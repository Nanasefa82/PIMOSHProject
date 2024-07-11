const express = require('express');
const router = express.Router();
const tutorInterestController = require('../controllers/tutorInterestController');
const upload = require('../middlewares/fileUpload');
const { validateTutorInterest, validationResult } = require('../middlewares/validator');

// New TutorInterest form


router.get('/new', tutorInterestController.new);

// Create a new TutorInterest
router.post('/', upload,validateTutorInterest, tutorInterestController.create);

// Show acknowledgement page
router.get('/acknowledgement', tutorInterestController.acknowledgement);

// List all TutorInterests
router.get('/', tutorInterestController.index);

// Show a specific TutorInterest
router.get('/:id', tutorInterestController.show);

// Edit form for a specific TutorInterest
router.get('/:id/edit', tutorInterestController.edit);

// Update a specific TutorInterest
router.post('/:id', tutorInterestController.update);

// Delete a specific TutorInterest
router.post('/:id/delete', tutorInterestController.delete);


module.exports = router;
