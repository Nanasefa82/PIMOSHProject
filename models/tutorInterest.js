const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tutorInterestSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'] },
    email: { type: String, required: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    interestedRole: { type: [String], required: true, enum: ['Administrative Support', 'Coordinating Supervisor', 'Tutorial and Academic Mentor'] },
    courses: { type: [String], required: true, enum: ['English/Language Arts', 'Foreign Language', 'History', 'Math - Elementary and Middle School', 'Math - High School', 'Science - High School', 'Science Technology (STEM)', 'Other'] },
    mostRecentSchool: { type: String, required: true },
    currentEmployment: { type: String, required: true },
    aboutYou: { type: String, required: true },
    interestInWorking: { type: String, required: true },
    coverLetter: { type: String, required: true },
    resume: { type: String, required: true },
    selfie: { type: String, required: true },
    howDidYouHear: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('TutorInterest', tutorInterestSchema);
