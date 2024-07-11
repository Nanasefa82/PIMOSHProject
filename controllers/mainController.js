exports.getHome = (req, res, next) => {
    res.render('index');
};

exports.getAbout = (req, res, next) => {
    res.render('about_us');
};


exports.getTestimonials = (req, res, next) => {
    res.render('testimonials');
};

exports.getBlog = (req, res, next) => {
    res.render('blog');
};

exports.getEvents = (req, res, next) => {
    res.render('mainevents');
};

exports.getFaq = (req, res, next) => {
    res.render('faq');
};

exports.getContact = (req, res, next) => {
    res.render('contact');
};


exports.getTechTitans = (req, res, next) => {
    res.render('mainevents');

};
exports.getArts = (req, res, next) => {
    res.render('arts');
};

exports.getEducation = (req, res, next) => {
    res.render('education');
};

exports.getTechTitans = (req, res, next) => {
    res.render('tech_titans');
};

//Get-A-Tutor - ZM
exports.getGetATutor = (req, res, next) => {
    res.render('get_a_tutor');
};

//Techology - AL
exports.getTechnology = (req, res, next) => {
    res.render('services/technology');
}

exports.getArts = (req, res, next) => {
    res.render('services/arts');
};

exports.getEducation = (req, res, next) => {
    res.render('services/education');
};
