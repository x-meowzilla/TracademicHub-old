var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var userSchema = new Schema({

    utorid: {type: String, required: true, unique: true},
    salt: {type: String},
    hash: {type: String},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    preferredName: {type: String, default: ''},
    accessLevel: {type: Number, required: true, default: 10}
    // lastLoginDate: {type: Date, index: true}
    // studentNumber: {type: String, unique: true},
    // email: {type: String},
    // libraryNumber: {type: String, unique: true}, //


}, {collection: 'UsersDB'});

// method for local user
userSchema.methods.encryptPassword = function (password) {
    var user = this;
    var salt = crypto.randomBytes(16).toString('base64');
    var hash = crypto.createHmac('sha512', salt).update(password).digest('base64');
    user.salt = salt;
    user.hash = hash;
};

// method for local user
userSchema.methods.verifyPassword = function (password) {
    var user = this;
    var hash = crypto.createHmac('sha512', user.salt).update(password).digest('base64');
    return (user.hash === hash);
};

userSchema.methods.getUTORid = function () {
    var user = this;
    return user.utorid;
};

userSchema.methods.getFullName = function () {
    var user = this;
    return user.firstName + ' ' + user.lastName;
};

userSchema.methods.getPreferredName = function () {
    var user = this;
    return user.preferredName;
};

userSchema.methods.setPreferredName = function (preferredName) {
    var user = this;
    user.preferredName = preferredName;
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
