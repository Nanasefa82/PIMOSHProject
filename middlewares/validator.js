const { body, validationResult } = require('express-validator');
const moment = require('moment');

// validate story id
exports.validateId = (req, res, next) => {
    const id = req.params.id;
    if (!id) {
        const err = new Error('No ID provided');
        err.status = 400;
        return next(err);
    } else if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        const err = new Error('Invalid Event ID format');
        err.status = 400;
        return next(err);
    }
    return next();
};

exports.validateSignUp = [
    body('firstName', 'First name is required').notEmpty().trim().escape(),
    body('lastName', 'Last Name is required').notEmpty().trim().escape(),
    body('email', 'Email is not valid').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be between 8 and 64 characters').isLength({ min: 8, max: 64 })
];

exports.validateLogIn = [
    body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({ min: 8, max: 64 })
];

// Validate Start and End Date
exports.validateStartEndDate = (req, res, next) => {
    const { startDate, endDate } = req.body;

    // Use moment to handle dates and times
    const now = moment(); // Current time
    const start = moment(startDate); // Assumes startDate includes both date and time
    const end = moment(endDate); // Assumes endDate includes both date and time

    // Check if the start date and time is after the current moment
    if (!start.isAfter(now)) {
        req.flash('error', 'Start must be after today.');
        return res.redirect('back');
    }

    // Check if the end date and time is after the start date and time
    if (!end.isAfter(start)) {
        req.flash('error', 'End must be after Start.');
        return res.redirect('back');
    }

    next();
};

// Middleware to log validation errors
exports.logValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
    }
    next();
};

// Your existing validateTutor middleware
exports.validateTutor = [
    body('firstName').notEmpty().withMessage('First Name is required').trim().escape(),
    body('lastName').notEmpty().withMessage('Last Name is required').trim().escape(),
    body('phone').matches(/^\d{3}-\d{3}-\d{4}$/).withMessage('Phone number must be in the format 123-456-7890').trim().escape(),
    body('email').isEmail().withMessage('Please enter a valid email address').trim().escape().normalizeEmail(),
    body('dob').isISO8601().withMessage('Date of Birth is required').toDate(),
    body('address').notEmpty().withMessage('Address is required').trim().escape(),
    body('city').notEmpty().withMessage('City is required').trim().escape(),
    body('state').notEmpty().withMessage('State is required').trim().escape(),
    body('zipCode').notEmpty().withMessage('Zip Code is required').isNumeric().withMessage('Zip Code must be numeric').trim().escape(),
    body('sessionType').isIn(['InPerson', 'Virtual', 'Hybrid']).withMessage('Session Type is required').trim().escape(),
    body('siteLocation').optional({ checkFalsy: true }).trim().escape(),
    body('teamLead').optional({ checkFalsy: true }).trim().escape(),
    body('pimoshRole').isIn(['Admin', 'Coordinating Supervisor', 'Tutor-Mentor']).withMessage('PIMOSH Role is required').trim().escape(),
    body('recentEducation').notEmpty().withMessage('Most Recent Education is required').trim().escape(),
    body('subjectsInterest').isArray({ min: 1 }).withMessage('At least one Subject of Interest is required'),
    body('subjectsInterest.*').isIn(['Business Etiquette', 'English (Reading)', 'Language Arts', 'Math', 'Technology', 'Civics', 'History', 'Foreign Language', 'Science', 'Other']).withMessage('Invalid subject').trim().escape(),
    body('guardianName').optional({ checkFalsy: true }).trim().escape(),
    body('guardianAddress').optional({ checkFalsy: true }).trim().escape(),
    body('recentEmployer').notEmpty().withMessage('Most Recent Employer is required').trim().escape(),
    body('workAddress').notEmpty().withMessage('Work Address is required').trim().escape(),
    body('supervisorPhone').matches(/^\d{3}-\d{3}-\d{4}$/).withMessage('Supervisor Phone number must be in the format 123-456-7890').trim().escape(),
    body('learnAboutPimosh').isArray({ min: 1 }).withMessage('At least one source is required'),
    body('learnAboutPimosh.*').isIn(['Social Media', 'CMS Website', 'Career Fair', 'Tech-Titans', 'Referral', 'Other']).withMessage('Invalid source').trim().escape(),
    body('allergiesMedications').optional({ checkFalsy: true }).trim().escape(),
    body('emergencyContact1').notEmpty().withMessage('First Emergency Contact is required').trim().escape(),
    body('emergencyPhone1').matches(/^\d{3}-\d{3}-\d{4}$/).withMessage('First Emergency Phone number must be in the format 123-456-7890').trim().escape(),
    body('emergencyContact2').optional({ checkFalsy: true }).trim().escape(),
    body('emergencyPhone2').optional({ checkFalsy: true }).matches(/^\d{3}-\d{3}-\d{4}$/).withMessage('Emergency Phone number must be in the format 123-456-7890').trim().escape(),
    body('signature').notEmpty().withMessage('Signature is required').trim().escape(),
    body('todayDate').isISO8601().withMessage('Date is required').toDate(),
    body('initials').notEmpty().withMessage('Initials are required').trim().escape(),
    body('agreementAcknowledged').equals('on').withMessage('You must agree to the terms')
];

// Middleware to check validation results
exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            console.log(error);
        });
        return res.redirect('back');
    }
    next();
};

// Middleware to check file uploads
exports.validateFiles = (req, res, next) => {
    const errors = [];

    if (!req.files.coverLetter) {
        errors.push('Cover letter is required');
    }
    if (!req.files.selfie) {
        errors.push('Selfie is required');
    }
    if (!req.files.resume) {
        errors.push('Resume is required');
    }
    if (!req.files.image) {
        errors.push('Image is required');
    }

    if (errors.length > 0) {
        req.flash('error', errors);
        return res.redirect('back');
    }

    next();
};

// validate tutor interest form
exports.validateTutorInterest = [
    body('firstName').notEmpty().withMessage('First Name is required').trim().escape(),
    body('lastName').notEmpty().withMessage('Last Name is required').trim().escape(),
    body('dob').isISO8601().withMessage('Date of Birth is required').toDate(),
    body('gender').notEmpty().withMessage('Gender is required').trim().escape(),
    body('email').isEmail().withMessage('Please enter a valid email address').trim().escape().normalizeEmail(),
    body('contactNo').matches(/^\d{3}-\d{3}-\d{4}$/).withMessage('Contact number must be in the format 123-456-7890').trim().escape(),
    body('address').notEmpty().withMessage('Address is required').trim().escape(),
    body('city').notEmpty().withMessage('City is required').trim().escape(),
    body('state').notEmpty().withMessage('State is required').trim().escape(),
    body('zipCode').notEmpty().withMessage('Zip Code is required').isNumeric().withMessage('Zip Code must be numeric').trim().escape(),
    // Interested Role
    body('interestedRole').custom(value => {
        if (!Array.isArray(value)) {
            value = [value];
        }
        if (value.length === 0) {
            throw new Error('At least one interested role is required');
        }
        return value.every(role => ['Administrative Support', 'Coordinating Supervisor', 'Tutorial and Academic Mentor'].includes(role));
    }),
    // Courses to Tutor
    body('courses').custom(value => {
        if (!Array.isArray(value)) {
            value = [value];
        }
        if (value.length === 0) {
            throw new Error('At least one course is required');
        }
        return value.every(course => [
            'English/Language Arts',
            'Foreign Language',
            'History',
            'Math - Elementary and Middle School',
            'Math - High School',
            'Science - High School',
            'Science Technology (STEM)',
            'Other'
        ].includes(course));
    }),
    body('mostRecentSchool').notEmpty().withMessage('Most recent school is required').trim().escape(),
    body('currentEmployment').notEmpty().withMessage('Current employment is required').trim().escape(),
    body('aboutYou').notEmpty().withMessage('Tell us about yourself is required').trim().escape(),
    body('interestInWorking').notEmpty().withMessage('Interest in working with PIMOSH is required').trim().escape(),
    body('howDidYouHear').notEmpty().withMessage('How did you hear about us is required').trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('Validation Errors:', errors.array());
            req.flash('error', errors.array().map(err => err.msg));
            return res.redirect('/tutorInterests/new');
        }
        next();
    }
];

exports.validateRole = [
    body('firstName').trim().notEmpty().withMessage('First name is required').isAlpha().withMessage('First name must contain only letters').escape(),
    body('lastName').trim().notEmpty().withMessage('Last name is required').isAlpha().withMessage('Last name must contain only letters').escape(),
    body('dob').trim().notEmpty().withMessage('Date of Birth is required').isISO8601().withMessage('Date of Birth must be a valid date').toDate(),
    body('contactNo').trim().notEmpty().withMessage('Phone Number is required').matches(/^\d{3}-\d{3}-\d{4}$/).withMessage('Phone number must be in the format 123-456-7890').escape(),
    body('email').trim().notEmpty().withMessage('User reference is required').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
    body('role').trim().notEmpty().withMessage('Role is required').isIn(['Administrator', 'Supervisor', 'Volunteer', 'Certified Teacher', 'Intern (from College or University)']).withMessage('Invalid role').escape()
];
