const User = require('../models/user');
const Session = require('../models/session');
const { DateTime } = require('luxon');
const moment = require('moment');


// const addOneHour = (startTime) => {
//     const [hours, minutes] = startTime.split(':');
//     let endHour = parseInt(hours) + 1;
//     if (endHour === 24) endHour = 0; // Handle 24-hour format wrap around
//     return `${endHour.toString().padStart(2, '0')}:${minutes}`;
// };
//show the events page

exports.index = async (req, res, next) => {
    try {
        // Get year and month from query parameters, default to current year and month if not provided
        const year = parseInt(req.query.year) || DateTime.now().year;
        const month = parseInt(req.query.month) || DateTime.now().month;
        const daysInMonth = DateTime.local(year, month).daysInMonth;

        const sessions = await Session.find({
            date: { $lte: DateTime.local(year, month, daysInMonth).toJSDate() },
            booked: 'Yes'
        });

        res.render('session/adminIndex', { sessions, year, month, daysInMonth, moment });
    } catch (err) {
        console.error('Error fetching events:', err);
        next(err);
    }
};
// exports.tutorIndex = async (req, res, next) => {
//     try {
//         // Get year and month from query parameters, default to current year and month if not provided
//         const year = parseInt(req.query.year) || DateTime.now().year;
//         const month = parseInt(req.query.month) || DateTime.now().month;
//         const daysInMonth = DateTime.local(year, month).daysInMonth;

//         const sessions = await Session.find({
//             date: { $lte: DateTime.local(year, month, daysInMonth).toJSDate() },
//             booked: 'No'

//         });

//         res.render('session/tutorIndex', { sessions, year, month, daysInMonth, moment });
//     } catch (err) {
//         console.error('Error fetching events:', err);
//         next(err);
//     }
// };


// Render the session creation form 
exports.new = (req, res, next) => {

    const userid = req.session.user; 
    User.findById(userid)
        .then(user => {
            if (user) {
                const errors = req.flash('error');
                res.render('./session/new', { errors, user }); 
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
    const {date, startTime, details, booked } = req.body;


    const newSession = new Session({
        date,
        startTime,
        details,
        booked
    });
    newSession.save()
        .then(() => res.redirect('/sessions'))
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', err.message);
                res.redirect('/session/new');
            } else {
                next(err);
            }
        });
};
//Show a particular event
exports.show = (req, res, next) => {
    const id = req.params.id;
    Promise.all([
        Session.findById(id),
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


// Function to delete an event and corresponding RSVPs
exports.delete = (req, res, next) => {
    let id = req.params.id;

    // Delete the event and all associated RSVPs in parallel
    Promise.all([
        Session.findByIdAndDelete(id), // Delete the event
        tutorInterest.deleteMany({ event: id }) // Delete all RSVPs for the event
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
