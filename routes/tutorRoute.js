const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutorController');
const { ensureAuthenticated } = require('../middlewares/auth');
const { validateTutor, validateResult , validateFiles, logValidationErrors} = require('../middlewares/validator');
const upload = require('../middlewares/fileUpload');

router.get('/', ensureAuthenticated, tutorController.getTutors);
router.get('/new', ensureAuthenticated, tutorController.new);
router.post('/', ensureAuthenticated, upload,logValidationErrors,validateFiles, validateTutor, validateResult, tutorController.create);

router.get('/:id', ensureAuthenticated, tutorController.viewTutor); // View route
router.get('/edit/:id', ensureAuthenticated, tutorController.editTutor);
router.post('/edit/:id', ensureAuthenticated, upload, validateTutor, validateResult, tutorController.updateTutor);

router.post('/delete/:id', ensureAuthenticated, tutorController.deleteTutor);

module.exports = router;
