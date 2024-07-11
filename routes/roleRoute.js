const express = require('express');
const roleController = require('../controllers/roleController');
const { validateRole } = require('../middlewares/validator');
const { validationResult } = require('express-validator');
const router = express.Router();

// Display the signup form
router.get('/signup', roleController.signupForm);

// Create a new role
router.post('/signup', roleController.create);

// List all roles
router.get('/', roleController.list);

// Show a role by ID
router.get('/:id', roleController.show);

// Display the edit form
router.get('/:id/edit', roleController.editForm);

// Update a role
router.post('/:id/update', validateRole, roleController.update);

// Delete a role
router.post('/:id/delete', roleController.delete);

module.exports = router;
