var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var userSchema = new Schema({

    username: {type: String, required: true, unique: true},
    password: String, // choose either password or salt+hash
    salt: {type: String, required: true},
    hash: {type: String, required: true},
    // firstName: {type: String, required: true},
    // lastName: {type: String, required: true},
    // preferredName: {type: String, default: ''},
    // studentNumber: {type: String, unique: true},
    // email: {type: String},
    // // libraryNumber: {type: String, unique: true}, //
    // lastLoginDate: {type: Date, index: true},
    accessLevel: {type: Number, required: true, default: 10}

}, {collection: 'UsersDB'});

// encrypt user password and save as salt and hash
userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        // create salt and hash to encrypt the password
        user.salt = crypto.randomBytes(16).toString('base64');
        user.hash = crypto.createHmac('sha512', user.salt).update(password).digest('base64');
        user.password = null; // reset the user password to null
    }
    // pass to next handler
    next();
});


userSchema.methods.getUsername = function () {
    var user = this;
    return user.username;
};

userSchema.methods.verifyPassword = function (password) {
    var user = this;
    var hash = crypto.createHmac('sha512', user.salt).update(password).digest('base64');
    return (user.hash === hash);
};

userSchema.methods.getAccessLevel = function () {
    var user = this;
    return user.accessLevel;
};

var UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
