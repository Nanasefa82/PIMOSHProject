

//check if user is a guest
exports.isGuest = (req, res, next)=> {
    if(!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
}

//check if user is authenticated
exports.isLoggedIn = (req, res, next)=> {
    if(req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to login first');
        return res.redirect('/users/login');
    }
}


exports.ensureAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        req.flash('error', 'Please log in to view this resource');
        res.redirect('/login');
    }
};