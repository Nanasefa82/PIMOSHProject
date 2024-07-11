const { validationResult } = require('express-validator');
const Role = require('../models/Role');

exports.signupForm = (req, res) => {
    res.render('role/createRole');
};

exports.create = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        req.flash('error', errors.array().map(err => err.msg));
        return res.redirect('/roles/signup');
    }

    const { firstName, lastName, dob, contactNo, email, role } = req.body;

    const newRole = new Role({
        firstName,
        lastName,
        dob,
        contactNo,
        email,
        role
    });

    newRole.save()
        .then(() => {
            console.log(errors)
            req.flash('success', 'Role created successfully.');
            res.redirect('/users/login');
        })
        .catch(err => {
            console.error('Error creating role:', err);
            req.flash('error', 'Failed to create role. Please try again.');
            
            res.redirect('/roles/login');
        });
};

// List all roles
exports.list = (req, res, next) => {
    Role.find()
        .then(roles => {
            res.render('roles/list', { roles });
        })
        .catch(err => {
            console.error('Error listing roles:', err);
            req.flash('error', 'Failed to retrieve roles.');
            res.redirect('/');
        });
};

// Show a role by ID
exports.show = (req, res, next) => {
    Role.findById(req.params.id)
        .then(role => {
            if (!role) {
                req.flash('error', 'Role not found.');
                return res.redirect('/roles');
            }
            res.render('roles/show', { role });
        })
        .catch(err => {
            console.error('Error retrieving role:', err);
            req.flash('error', 'Failed to retrieve role.');
            res.redirect('/roles');
        });
};

// Display the edit form
exports.editForm = (req, res, next) => {
    Role.findById(req.params.id)
        .then(role => {
            if (!role) {
                req.flash('error', 'Role not found.');
                return res.redirect('/roles');
            }
            res.render('roles/edit', { role });
        })
        .catch(err => {
            console.error('Error retrieving role:', err);
            req.flash('error', 'Failed to retrieve role.');
            res.redirect('/roles');
        });
};

// Update a role
exports.update = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array().map(err => err.msg));
        return res.redirect(`/roles/${req.params.id}/edit`);
    }

    const { firstName, lastName, dob, contactNo, email, role } = req.body;

    Role.findByIdAndUpdate(req.params.id, {
        firstName,
        lastName,
        dob,
        contactNo,
        email,
        role
    }, { new: true, runValidators: true })
        .then(updatedRole => {
            req.flash('success', 'Role updated successfully.');
            res.redirect(`/roles/${updatedRole._id}`);
        })
        .catch(err => {
            console.error('Error updating role:', err);
            req.flash('error', 'Failed to update role. Please try again.');
            res.redirect(`/roles/${req.params.id}/edit`);
        });
};

// Delete a role
exports.delete = (req, res, next) => {
    Role.findByIdAndDelete(req.params.id)
        .then(result => {
            if (!result) {
                req.flash('error', 'Role not found.');
                return res.redirect('/roles');
            }
            req.flash('success', 'Role deleted successfully.');
            res.redirect('/roles');
        })
        .catch(err => {
            console.error('Error deleting role:', err);
            req.flash('error', 'Failed to delete role. Please try again.');
            res.redirect('/roles');
        });
};
