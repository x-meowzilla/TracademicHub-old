var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

    username: {type: String, required: true, unique: true},
    password: String, // choose either password or salt+saltedHash
    // salt: {type: String, required: true},
    // saltedHash: {type: String, required: true},
    // firstName: {type: String, required: true},
    // lastName: {type: String, required: true},
    // preferredName: {type: String, default: ''},
    // studentNumber: {type: String, unique: true},
    // email: {type: String},
    // // libraryNumber: {type: String, unique: true}, //
    // lastLoginDate: {type: Date, index: true},
    // accessLevel: {type: Number, required: true, default: 10}

}, {collection: 'users'});

// module.exports = mongoose.model('User', userSchema);
exports.User = mongoose.model('User', userSchema);
