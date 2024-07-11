const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
    firstName: { type: String, required: [true, 'First name is required'] },
    lastName: { type: String, required: [true, 'Last name is required'] },
    dob: { type: Date, required: [true, 'Date of Birth is required'] },
    contactNo: { type: String, required: [true, 'Phone Number is required'] },
    email: { type: String, required: [true, 'User reference is required'] },
    role: { type: String, required: true, enum: ['Administrator','Supervisor','Volunteer','Certified Teacher','Intern (from College or University)'] }
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
