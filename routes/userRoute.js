const express = require('express');
const tutorController = require('../controllers/tutorController');
const userController = require('../controllers/userController');
const { ensureAuthenticated } = require('../middlewares/auth');
const { validateResult , validateSignUp} = require('../middlewares/validator');
const upload = require('../middlewares/fileUpload');


const router = express.Router();



// Set up Interest Route 
router.get('/signup', userController.getSignup);

//POST /users: create a new user account
router.post('/',validateSignUp,validateResult, userController.create);

//POST /users/login: GET user's login form
router.get('/login', userController.getLogin);


//POST /users/login: authenticate user's login
router.post('/login', validateResult, userController.login);

//GET /users/profile: send user's profile page

router.get('/profile', ensureAuthenticated, validateResult, userController.profile);

//router.post('/profile', ensureAuthenticated, userController.profile);


router.get('/logout', userController.logout);


module.exports = router;
