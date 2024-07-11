const express = require('express');
const controller = require('../controllers/mainController');
const router = express.Router();

// Set up Home Route 
router.get('/', controller.getHome);

// Set up About Us Route 
router.get('/about_us', controller.getAbout);

// Set up Testimonials Route 
router.get('/testimonials', controller.getTestimonials);

// Set up Blog Route 
router.get('/blog', controller.getBlog);  

// Set up Events Route 
router.get('/mainevents', controller.getEvents);

// Set up FAQ Route 
router.get('/faq', controller.getFaq);

// Set up Contact Route 
router.get('/contact', controller.getContact);

//<<<<<<< HEAD
//=======
// Set Up Tech Titans Route


//<<<<<<< HEAD
//=======


// Set Up Tech Titans Route 
router.get('/tech_titans', controller.getTechTitans);

//Set Up Get-A-Tutor route - ZM
router.get('/get_a_tutor', controller.getGetATutor);

//Set Up Technology - AL
router.get('/services/technology', controller.getTechnology);

// Set up Arts Route 
router.get('/services/arts', controller.getArts);

// Set up Education Route 
router.get('/services/education', controller.getEducation);


module.exports = router;
