const { error } = require('console');
const TutorInterest = require('../models/tutorInterest');
const { validationResult } = require('express-validator');
const transporter = require('../middlewares/emailConfig'); 

// Display the form for creating a new TutorInterest
exports.new = (req, res, next) => {
    res.render('tutorInterest/tutorInterest_form');
};

// Create a new TutorInterest
exports.create = (req, res, next) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('Validation Errors:', errors.array());
        req.flash('error', errors.array().map(err => err.msg));
        return res.redirect('/tutorInterests/new');
    }

    // Log the received form data for debugging
    console.log('Received form data:', req.body);
    console.log('Received files:', req.files);

    const {
        firstName, lastName, dob, gender, email, contactNo, address,
        city, state, zipCode, interestedRole, courses, mostRecentSchool,
        currentEmployment, aboutYou, interestInWorking, howDidYouHear
    } = req.body;

    const coverLetter = req.files.coverLetter ? req.files.coverLetter[0].path : '';
    const selfie = req.files.selfie ? req.files.selfie[0].path : '';
    const resume = req.files.resume ? req.files.resume[0].path : '';

    const newTutorInterest = new TutorInterest({
        firstName,
        lastName,
        dob,
        gender,
        email,
        contactNo,
        address,
        city,
        state,
        zipCode,
        interestedRole: Array.isArray(interestedRole) ? interestedRole : [interestedRole],
        courses: Array.isArray(courses) ? courses : [courses],
        mostRecentSchool,
        currentEmployment,
        aboutYou,
        interestInWorking,
        howDidYouHear,
        coverLetter,
        selfie,
        resume
    });

    console.log('New Tutor Interest Object:', newTutorInterest);

    newTutorInterest.save()
        .then(() => {
            console.log('Tutor interest application saved successfully');
            req.flash('success', 'Application submitted successfully');
            // Pass the email as a query parameter to the acknowledgement route
            res.redirect(`/tutorInterests/acknowledgement?email=${encodeURIComponent(email)}`); // Replace with your success page
        })
        .catch(err => {
            console.error('Error saving new tutor interest:', err);
            if (err.name === 'ValidationError') {
                console.error('Validation Error:', err.message);
                // Log all validation errors in detail
                for (field in err.errors) {
                    console.error(err.errors[field].message);
                }
                req.flash('error', 'Failed to create tutor interest. Please check the form for errors.');
            } else {
                req.flash('error', 'An unexpected error occurred. Please try again.');
            }
            res.redirect('/tutorInterests/new');
        });
};



// controllers/tutorInterestController.js

exports.acknowledgement = (req, res, next) => {
    const email = req.query.email; // Get the email from the query parameters

    if (!email) {
        console.error('No email address provided for acknowledgement');
        req.flash('error', 'No email address provided. Please try again.');
        return res.redirect('/tutorInterests/new');
    }

    console.log('Received email for acknowledgement:', email);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email, // Ensure this is the email of the interested person
        subject: 'Acknowledgement of Interest',
        text: 'Thank you for your interest. Here are the next steps...'
    };

    console.log('Mail options:', mailOptions);

    transporter.sendMail(mailOptions)
        .then(() => {
            console.log('Email sent successfully to:', email);

            const nextSteps = [
                "Getting a background check with CMS at https://www.cmsvolunteers.com/",
                "After successful background check, proceed to sign up with PIMOSH at www.pimosh.net/signup",
                "Select your 1-on-1 appointment schedule with the Executive Director"
            ];
            res.render('tutorInterest/acknowledgement', { nextSteps });
        })
        .catch(err => {
            console.error('Error rendering acknowledgement page or sending email:', err);
            req.flash('error', 'An unexpected error occurred. Please try again.');
            res.redirect('/tutorInterests/new');
        });
      
};



// List all TutorInterests
exports.index = (req, res, next) => {
    TutorInterest.find()
        .then(tutorInterests => {
            res.render('tutorInterest_index', { tutorInterests });
        })
        .catch(err => next(err));
};


// Show details of a specific TutorInterest
exports.show = (req, res, next) => {
    TutorInterest.findById(req.params.id)
        .then(tutorInterest => {
            if (tutorInterest) {
                res.render('tutorInterest_show', { tutorInterest });
            } else {
                req.flash('error', 'Tutor interest not found');
                res.redirect('/tutorInterests');
            }
        })
        .catch(err => next(err));
};

// Show form for editing a specific TutorInterest
exports.edit = (req, res, next) => {
    TutorInterest.findById(req.params.id)
        .then(tutorInterest => {
            if (tutorInterest) {
                res.render('tutorInterest_edit', { tutorInterest });
            } else {
                req.flash('error', 'Tutor interest not found');
                res.redirect('/tutorInterests');
            }
        })
        .catch(err => next(err));
};

// Update a specific TutorInterest
exports.update = (req, res, next) => {
    TutorInterest.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true })
        .then(tutorInterest => {
            if (tutorInterest) {
                res.redirect(`/tutorInterests/${tutorInterest._id}`);
            } else {
                req.flash('error', 'Tutor interest not found');
                res.redirect('/tutorInterests');
            }
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', 'Validation error');
                res.redirect(`/tutorInterests/${req.params.id}/edit`);
            } else {
                next(err);
            }
        });
};

// Delete a specific TutorInterest
exports.delete = (req, res, next) => {
    TutorInterest.findByIdAndRemove(req.params.id)
        .then(() => {
            req.flash('success', 'Tutor interest deleted successfully');
            res.redirect('/tutorInterests');
        })
        .catch(err => next(err));
};
