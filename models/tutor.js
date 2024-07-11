// models/tutor.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tutorSchema = new Schema({
    // Section 1: Team or Volunteer Applicant Information
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    dob: { type: Date, required: true },
    stateId: { type: String, required: true }, // Path to uploaded file
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    sessionType: { type: String, enum: ['InPerson', 'Virtual', 'Hybrid'], required: true },
    siteLocation: { type: String },
    teamLead: { type: String },
    pimoshRole: { type: String, enum: ['Admin', 'Coordinating Supervisor', 'Tutor-Mentor'], required: true },

    // Section 2: Team Member's Most Recent Education & Subjects of Interest
    recentEducation: { type: String, required: true },
    subjectsInterest: [{
        type: String, 
        enum: ['Business Etiquette', 'English (Reading)', 'Language Arts', 'Math', 'Technology', 'Civics', 'History', 'Foreign Language', 'Science', 'Other']
    }],

    // Section 3: Team Member's Parent/Guardian (if under 18) & Work History
    guardianName: { type: String },
    guardianAddress: { type: String },
    recentEmployer: { type: String, required: true },
    workAddress: { type: String, required: true },
    supervisorPhone: { type: String, required: true },

    // Section 4: How Did You Learn About PIMOSH? (Be Specific)
    learnAboutPimosh: [{
        type: String, 
        enum: ['Social Media', 'CMS Website', 'Career Fair', 'Tech-Titans', 'Referral', 'Other']
    }],

    // Section 5: Team Member's Health Snapshot & Emergency Contact Information
    allergiesMedications: { type: String },
    emergencyContact1: { type: String, required: true },
    emergencyPhone1: { type: String, required: true },
    emergencyContact2: { type: String },
    emergencyPhone2: { type: String },

    // Section 6: General Agreement, Consent & Authorization Sign-On Line
    signature: { type: String, required: true },
    todayDate: { type: Date, required: true },
    initials: { type: String, required: true },
    agreementAcknowledged: { type: Boolean, required: true }, // New field to acknowledge the agreement

    // Uploads
    coverLetter: { type: String, required: true }, // Path to uploaded file
    selfie: { type: String, required: true }, // Path to uploaded file
    resume: { type: String, required: true }, // Path to uploaded file
    
    // Link to the user
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    accepted: {type: String, required: true, enum: ['Accepted', 'Not Accepted'] }
}, { timestamps: true });

module.exports = mongoose.model('Tutor', tutorSchema);
