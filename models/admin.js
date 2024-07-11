const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const { stringify } = require('querystring');

const roleSchema = new Schema({
    firstName: { type: String, required: [true, 'First name is required'] },
    lastName: { type: String, required: [true, 'Last name is required'] },
    email: { type: String, required: [true, 'Email address is required'], unique: [true, 'This email address has been used'] },
    password: { type: String, required: [true, 'Password is required'] },
    role: { type: String, required: true, enum: ['Administrator','Supervisor','Volunteer','Certified Teacher','Intern (from College or University)']}
}, { timestamps: true });

module.exports = mongoose.model('ROle', roleSchema);
