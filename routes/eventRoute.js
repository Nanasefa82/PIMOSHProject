const express = require('express');
const controller = require('../controllers/eventController');
const upload = require('../middlewares/fileUpload');
const { isLoggedIn } = require('../middlewares/auth');
const { validateResult } = require('../middlewares/validator');

const router = express.Router();

// GET /event: send all events to the user
router.get('/', controller.index);

// GET /event/new: Send HTML form for creating a new event
router.get('/new', isLoggedIn, controller.new);

// POST /event: create a new event
router.post('/', isLoggedIn, upload, validateResult, controller.create);

// GET /event/:id: send details of event identified by id
router.get('/:id', controller.show);

// GET /event/:id/edit: send HTML form for editing an existing event
router.get('/:id/edit', isLoggedIn, controller.edit);

// PUT /event/:id: update the event identified by id
router.put('/:id', isLoggedIn, controller.update);

// DELETE /event/:id: delete the event identified by id
router.delete('/:id', isLoggedIn, controller.delete);

// GET /event/new: Send HTML form for creating a new rsvp
router.get('/:id/newRsvp', controller.newRsvp);

// GET /event/new: Send HTML form for creating a new rsvp
router.get('/:id/unRsvp', controller.unRsvp);

router.post('/:id/rsvp', controller.rsvp);

module.exports = router;
