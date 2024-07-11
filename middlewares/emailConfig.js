// config/emailConfig.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file

const transporter = nodemailer.createTransport({
    host: 'mail.pimosh.net', // Replace with your webmail provider's SMTP server
    port: 465, // Replace with the appropriate port (587 for TLS or 465 for SSL)
    secure: true, // Use true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

module.exports = transporter;
