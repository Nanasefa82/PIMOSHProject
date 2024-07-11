const { validationResult } = require('express-validator');
const User = require('../models/user');
const Tutor = require('../models/tutor');
const Role = require('../models/Role');
const path = require('path');
const Event = require('../models/event');
const bcrypt = require('bcrypt')

exports.getSignup = (req, res, next) => {
    res.render('./user/signup');
};

exports.getLogin = (req, res, next) => {
    res.render('./user/login');
};

exports.create = (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    // Check if email exists in the Role model
    Role.findOne({ email: email })
        .then(role => {
            if (!role) {
                console.log('Role not found for email:', email);
                req.flash('error', 'User email does not exist in the Role model');
                return res.redirect('/users/signup'); // Early return to prevent further execution
            }

            // Check if user already exists
            return User.findOne({ email: email }).then(user => {
                if (user) {
                    console.log('User already exists with email:', email);
                    req.flash('error', 'This email address has already been used');
                    return res.redirect('/users/signup'); // Early return to prevent further execution
                }

                // Create a new user
                const newUser = new User({
                    firstName,
                    lastName,
                    email,
                    password
                });

                // Save the new user
                return newUser.save().then(result => {
                    if (result) {
                        console.log('User created successfully:', result);
                        req.flash('success', 'User created successfully');
                        return res.redirect('/users/login'); // Early return to prevent further execution
                    }
                });
            });
        })
        .catch(err => {
            console.error('Error creating user:', err);
            req.flash('error', 'Failed to create user. Please try again.');
            return res.redirect('/users/signup');
        });
};

// Handle user login
exports.login = (req, res, next) => {
    const { email, password } = req.body;

    console.log('Login attempt:', { email, password });

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password');
                return res.redirect('/users/login');
            }

            user.comparePassword(password)
                .then(isMatch => {
                    if (!isMatch) {
                        req.flash('error', 'Invalid email or password');
                        return res.redirect('/users/login');
                    }

                    req.session.user = user;
                    req.flash('success', 'Login successful');
                    return res.redirect('/users/profile');
                })
                .catch(err => {
                    console.error('Error comparing passwords:', err);
                    req.flash('error', 'An error occurred while comparing passwords');
                    return res.redirect('/users/login');
                });
        })
        .catch(err => {
            console.error('Error logging in user:', err);
            req.flash('error', 'Failed to log in. Please try again.');
            return res.redirect('/users/login');
        });
};


// User Profile 
exports.profile = (req, res, next) => {
    let id = req.session.user;

    Promise.all([
        Tutor.find({ user: id }).sort({ name: 1 }),
        Event.find(),
        User.findById(id)
    ])
    .then(results => {
        const [tutors, events, user] = results;
        if (!user) {
            req.flash('error', 'User not found.');
            return res.redirect('/users/login');
        }
        res.render('./user/profile', { tutors, user, events });
    })
    .catch(err => next(err));
};

// Logout controller function
exports.logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/users/login'); // Redirect to the login page after logout
    });
};