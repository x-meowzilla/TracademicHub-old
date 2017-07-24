var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var userSchema = new Schema({

    utorid: {type: String, required: true, unique: true}, // required!!
    email: {type: String, required: true, unique: true},
    studentNumber: {type: Number, sparse: true, unique: true},
    name: {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        preferredName: {type: String, default: ''}
    },
    courseEnrolled: [{
        course: {type: Schema.Types.ObjectId, ref: 'Course', required: true},
        privilege: {type: Schema.Types.ObjectId, ref: 'AccessPrivilege', required: true}
    }],
    createDate: {type: Date, default: Date.now, required: true},
    lastLoginDate: {type: Date, index: true, sparse: true},
    isActive: {type: Boolean, default: true, required: true},
    isLocalUser: {type: Boolean, default: false, required: true},
    password: {
        salt: {type: String, sparse: true, unique: true},
        hash: {type: String, sparse: true, unique: true}
    },
    biography: {type: String, default: ''},
    avatarPath: {type: String, default: null}

}, {collection: 'collection-Users'});

// static methods
userSchema.statics.findUserData = function (findDoc) {
    "use strict";
    var user = this.model('User');
    return user.find(findDoc).populate('accessPrivilege');
};

userSchema.statics.updateUserData = function (userID, updateDoc) {
    "use strict";
    var user = this.model('User');
    return user.findByIdAndUpdate(userID, {$set: updateDoc}, {new: true}).populate('accessPrivilege');
};

// method for local user
userSchema.methods.encryptPassword = function (password) {
    "use strict";
    var user = this;
    var salt = crypto.randomBytes(16).toString('base64');
    var hash = crypto.createHmac('sha512', salt).update(password).digest('base64');
    user.password.salt = salt;
    user.password.hash = hash;
    user.isLocalUser = true;
};

// method for local user
userSchema.methods.verifyPassword = function (password) {
    "use strict";
    var user = this;
    if (user.password && user.password.salt) {
        var hash = crypto.createHmac('sha512', user.password.salt).update(password).digest('base64');
        return (user.password.hash === hash);
    } else {
        return false;
    }
};

userSchema.methods.setLegalName = function (fName, lName, pName) {
    "use strict";
    var user = this;
    user.name.firstName = fName;
    user.name.lastName = lName;
    user.name.preferredName = pName ? pName : '';
};

userSchema.methods.updateLastLoginDate = function () {
    "use strict";
    var user = this;
    user.lastLoginDate = Date.now();
    return user.save();
};

var UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
