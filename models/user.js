const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: { type: String, required: [true, 'First name is required'] },
    lastName: { type: String, required: [true, 'Last name is required'] },
    email: { type: String, required: [true, 'Email address is required'], unique: [true, 'This email address has been used'] },
    password: { type: String, required: [true, 'Password is required'] },
}, { timestamps: true });

userSchema.pre('save', function(next) {
    let user = this;

    // If password is not modified, proceed to next middleware
    if (!user.isModified('password')) return next();

    // Hash the password
    bcrypt.hash(user.password, 10)
        .then(hash => {
            user.password = hash;
            next();
        })
        .catch(err => next(err));
});

userSchema.methods.comparePassword = function(inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
