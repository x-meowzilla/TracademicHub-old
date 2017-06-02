var mongoose = require('mongoose');
var crypto = require('crypto');
var access = require('../modules/access_level');
var Schema = mongoose.Schema;

var userSchema = new Schema({

    utorid: {type: String, required: true, unique: true}, // required!!
    email: {type: String, unique: true},
    password: {
        isLocalUser: {type: Boolean, required: true, default: true},
        salt: {type: String, unique: true},
        hash: {type: String}
    },
    name: {
        firstName: {type: String, default: ''},
        lastName: {type: String, default: ''},
        preferredName: {type: String, default: ''}
    },
    accessLevel: {type: Number, required: true, default: access.ACCESS_LEVEL_STUDENT}

    // lastLoginDate: {type: Date, index: true}
    // studentNumber: {type: String, unique: true},
    // libraryNumber: {type: String, unique: true}, //

}, {collection: 'UsersDB'});

// method for local user
userSchema.methods.encryptPassword = function (password) {
    var user = this;
    var salt = crypto.randomBytes(16).toString('base64');
    var hash = crypto.createHmac('sha512', salt).update(password).digest('base64');
    user.password.salt = salt;
    user.password.hash = hash;
};

// method for local user
userSchema.methods.verifyPassword = function (password) {
    var user = this;
    var hash = crypto.createHmac('sha512', user.password.salt).update(password).digest('base64');
    return (user.password.hash === hash);
};

userSchema.methods.getUTORid = function () {
    var user = this;
    return user.utorid;
};

userSchema.methods.getFullName = function () {
    var user = this;
    return user.name.firstName + ' ' + user.name.lastName;
};

userSchema.methods.setName = function (firstName, lastName) {
    var user = this;
    user.name.firstName = firstName;
    user.name.lastName = lastName;
};

userSchema.methods.getPreferredName = function () {
    var user = this;
    return user.name.preferredName;
};

userSchema.methods.setPreferredName = function (preferredName) {
    var user = this;
    user.name.preferredName = preferredName;
};

userSchema.methods.getAccessLevel = function () {
    var user = this;
    return user.accessLevel;
};

userSchema.methods.setAccessLevel = function (accessLevel) {
    var user = this;
    user.accessLevel = accessLevel;
};


var UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
