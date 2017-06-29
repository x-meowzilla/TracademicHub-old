var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var userSchema = new Schema({

    utorid: {type: String, required: true, unique: true}, // required!!
    email: {type: String, required: true, unique: true},
    studentNumber: {type: Number, sparse: true, unique: true},
    accessPrivilege: {type: Schema.Types.ObjectId, ref: 'AccessPrivilege', required: true},
    createDate: {type: Date, default: Date.now},
    lastLoginDate: {type: Date, index: true, sparse: true},
    isActive: {type: Boolean, default: true, required: true},
    isLocalUser: {type: Boolean, default: false, required: true},
    password: {
        salt: {type: String},
        hash: {type: String}
    },
    name: {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        preferredName: {type: String, default: ''}
    },
    biography: {type: String, default: ''},
    avatarPath: {type: String, default: null}

}, {collection: 'UsersCollection', autoIndex: false}); // for production use

// static methods
userSchema.statics.findUserData = function (findDoc) {
    "use strict";
    var user = this.model('User');
    return user.find(findDoc);
};

userSchema.statics.updateUserData = function (userID, updateDoc) {
    "use strict";
    var user = this.model('User');
    return user.findByIdAndUpdate(userID, {$set: updateDoc}, {new: true});
};

userSchema.statics.deactivateUsers = function () {
    "use strict";
    var user = this.model('User');
    return user.update({isLocalUser: false}, {isActive: false}, {multi: true});
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

userSchema.methods.getFullName = function () {
    "use strict";
    var user = this;
    return {firstName: user.name.firstName, lastName: user.name.lastName};
};

userSchema.methods.setFullName = function (firstName, lastName) {
    "use strict";
    var user = this;
    user.name.firstName = firstName;
    user.name.lastName = lastName;
};

userSchema.methods.getPreferredName = function () {
    "use strict";
    var user = this;
    return user.name.preferredName;
};

userSchema.methods.setPreferredName = function (preferredName) {
    "use strict";
    var user = this;
    user.name.preferredName = preferredName;
};

userSchema.methods.updateLastLoginDate = function () {
    "use strict";
    var user = this;
    user.lastLoginDate = Date.now();
    return user.save();
};

var UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
