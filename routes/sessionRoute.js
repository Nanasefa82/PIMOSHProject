const express = require('express');
const controller = require('../controllers/sessionController');
const { isLoggedIn } = require('../middlewares/auth');
const { validateResult } = require('../middlewares/validator');

const router = express.Router();

// GET /event: send all events to the user
// router.get('/', controller.index);

router.get('/', controller.index);


// GET /event/new: Send HTML form for creating a new event
router.get('/new', isLoggedIn, controller.new);

// POST /event: create a new event
router.post('/', isLoggedIn, controller.create);

// GET /event/:id: send details of event identified by id
router.get('/:id', controller.show);

// DELETE /event/:id: delete the event identified by id
router.delete('/:id', isLoggedIn, controller.delete);

module.exports = router;
