var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({

    username: {type: String, required: true, unique: true},
    password: String, // choose either password or salt+saltedHash
    // salt: {type: String, required: true},
    // saltedHash: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    preferredName: {type: String, default: ''},
    studentNumber: {type: String, unique: true},
    email: {type: String},
    // libraryNumber: {type: String, unique: true}, //
    lastLoginDate: {type: Date, index: true},
    accessLevel: {type: Number, required: true, default: 10}

});

module.exports = mongoose.model('User', UserSchema);
