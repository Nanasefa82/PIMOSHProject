const eventModel = require('../models/event');
const usermodel = require('../models/user');
const RSVP = require('../models/rsvp');
const { DateTime } = require('luxon');
const { hostname } = require('os');
const moment = require('moment');

//show the events page

exports.index = async (req, res, next) => {
    try {
        // Get year and month from query parameters, default to current year and month if not provided
        const year = parseInt(req.query.year) || DateTime.now().year;
        const month = parseInt(req.query.month) || DateTime.now().month;
        const daysInMonth = DateTime.local(year, month).daysInMonth;

        const events = await eventModel.find({
            startDate: { $lte: DateTime.local(year, month, daysInMonth).toJSDate() },
            endDate: { $gte: DateTime.local(year, month, 1).toJSDate() }
        });

        res.render('event/index', { events, year, month, daysInMonth, moment });
    } catch (err) {
        console.error('Error fetching events:', err);
        next(err);
    }
};


// Render the events creation form 
exports.new = (req, res, next) => {

    const userid = req.session.user; 
    usermodel.findById(userid)
        .then(user => {
            if (user) {
                const errors = req.flash('error');
                res.render('./event/new', { errors, user }); 
            } else {
                req.flash('error', 'User not found');
                res.redirect('/login');
            }
        })
        .catch(err => {
            req.flash('error', 'Failed to fetch user details');
            return next(err);
        });
};


// Create a new event
    exports.create = (req, res, next) => {
    let event = req.body;

    // Handle file upload
    if (req.files && req.files.image && req.files.image[0]) {
        event.image = "/uploads/images/" + req.files.image[0].filename;
        console.log('Image path:', event.image); // Debugging line
    } else {
        event.image = '/uploads/images/event_flyer.jpg'; // Default image if none is uploaded
    }

    const newEvent = new eventModel(event);
    newEvent.save()
        .then(() => res.redirect('/events'))
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', err.message);
                res.redirect('/events/new');
            } else {
                next(err);
            }
        });
};
//Show a particular event
    exports.show = (req, res, next) => {
    const eventId = req.params.id;
    Promise.all([
        eventModel.findById(eventId),
        RSVP.countDocuments({ event: eventId })
    ])
    .then(([event, RSVPCount]) => {
        if (!event) {
            req.flash('error', 'Event not found');
            return res.redirect('/events');
        }

        event.formattedStartDate = event.startDate
            ? DateTime.fromJSDate(event.startDate).toLocaleString(DateTime.DATETIME_SHORT)
            : 'No start date provided';
        event.formattedEndDate = event.endDate
            ? DateTime.fromJSDate(event.endDate).toLocaleString(DateTime.DATETIME_SHORT)
            : 'No end date provided';

        res.render('./event/show', {
            event,
            RSVPCount,
            formattedStartDate: event.formattedStartDate,
            formattedEndDate: event.formattedEndDate
        });
    })
    .catch(err => {
        console.error('Error displaying event:', err);
        next(err);
    });
};


// Edit Controller Function
exports.edit = (req, res, next) => {
    let id = req.params.id;
    let userid = req.session.user;
       Promise.all([eventModel.findById(id).lean(), usermodel.findById(userid)])
        .then(results => {
            const [event, user] = results;
            if (event) {
                if (event.startDate) {
                    event.startDate = DateTime.fromJSDate(event.startDate).toFormat('yyyy-LL-dd\'T\'HH:mm');
                }
                if (event.endDate) {
                    event.endDate = DateTime.fromJSDate(event.endDate).toFormat('yyyy-LL-dd\'T\'HH:mm');
                }
                res.render('./event/edit', { event, user }); 
            } else {
                req.flash('error', 'Unauthorized access or event not found'); 
                res.status(401).redirect('/error?status=401');
            }
        })
        .catch(err => next(err));
};


// Update an event
exports.update = (req, res, next) => {
    let event = req.body;
    let id = req.params.id;
    let userid = req.session.user;
    if (event.startDate) {
        event.startDate = DateTime.fromFormat(event.startDate, 'yyyy-LL-dd\'T\'HH:mm', { zone: 'local' }).toUTC().toJSDate();
    }
    if (event.endDate) {
        event.endDate = DateTime.fromFormat(event.endDate, 'yyyy-LL-dd\'T\'HH:mm', { zone: 'local' }).toUTC().toJSDate();
    }
    eventModel.findByIdAndUpdate(id, event, { useFindAndModify: false, new: true, runValidators: true })
        .then(event => {
            
                // console.log('Updated event:', event);
                res.redirect('/events/' + id);
            } )
            .catch(err => {
            console.error('Error during event update:', err);
            if (err.name === 'ValidationError') {
                err.status = 400;
            }
            next(err);
        });
};


// Function to delete an event and corresponding RSVPs
exports.delete = (req, res, next) => {
    let id = req.params.id;

    // Delete the event and all associated RSVPs in parallel
    Promise.all([
        eventModel.findByIdAndDelete(id), // Delete the event
        RSVP.deleteMany({ event: id }) // Delete all RSVPs for the event
    ])
    .then(([event, rsvpResult]) => {
        if (event) {
            req.flash('success', 'Event and corresponding RSVPs deleted successfully.');
            res.redirect('/users/profile');
        } else {
            req.flash('error', 'No event found with the given ID.');
            res.redirect('/events');
        }
    })
    .catch(err => {
        console.error('Error during event and RSVP deletion:', err);
        req.flash('error', 'Failed to delete event and RSVPs.');
        res.redirect('/events');
    });
};

exports.newRsvp = async (req, res, next) => {
    let id = req.params.id;
    const status = req.body.status;

    Promise.all([eventModel.findById(id).lean()])
        .then(results => {
            const [event] = results;
            if (event) {
                res.render('./event/rsvpForm', { event }); 
            }
        })
}

exports.unRsvp = async (req, res, next) => {
    let id = req.params.id;
    const status = req.body.status;

    Promise.all([eventModel.findById(id).lean()])
        .then(results => {
            const [event] = results;
            if (event) {
                res.render('./event/unRsvpForm', { event }); 
            }
        })
}


exports.rsvp = async (req, res, next) => {
    const eventId = req.params.id;
    const { fname, lname, phone, email, forWho, members, repSchool, amount, special, status } = req.body;

    // Server-side validation
    if (!phone || !status) {
        req.flash('error', 'Phone number and status are required');
        return res.redirect(`/events/${eventId}`);
    }

    // If status is 'No', only phone number and status are required
    if (status === 'No') {
        try {
            const rsvp = await RSVP.findOneAndDelete(
                { phone: phone, event: eventId },
                { status: 'No' },
                { new: true, upsert: false } // Do not create a new RSVP if it doesn't exist
            );

            if (!rsvp) {
                req.flash('error', 'RSVP not found for the provided phone number');
                return res.redirect(`/events/${eventId}`);
            }

            res.redirect('/events');
        } catch (err) {
            console.error('Error processing RSVP:', err);
            next(err);
        }
    } else {
        // Validate required fields for submitting RSVP
        if (!fname || !lname || !email || !forWho || !members || !repSchool || !amount) {
            req.flash('error', 'All required fields must be filled out');
            return res.redirect(`/events/${eventId}`);
        }

        try {
            const event = await eventModel.findById(eventId);

            if (!event) {
                req.flash('error', 'Event not found');
                return res.redirect('/events');
            }

            // Create an object with the fields to update
            const updateFields = { fname, lname, phone, email, event: eventId, forWho, members, repSchool, amount, special, status };

            // Process the RSVP, updating if one exists based on phone number and event ID or creating a new one
            const rsvp = await RSVP.findOneAndUpdate(
                { phone: phone, event: eventId },
                { $set: updateFields },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );

            if (!rsvp) {
                throw new Error('Failed to create or update RSVP');
            }

            res.redirect('/events');
        } catch (err) {
            console.error('Error processing RSVP:', err);
            next(err);
        }
    }
};