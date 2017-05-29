var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

    username: {type: String, required: true, unique: true},
    password: String, // choose either password or salt+saltedHash
    salt: {type: String, required: true},
    saltedHash: {type: String, required: true},
    // firstName: {type: String, required: true},
    // lastName: {type: String, required: true},
    // preferredName: {type: String, default: ''},
    // studentNumber: {type: String, unique: true},
    // email: {type: String},
    // // libraryNumber: {type: String, unique: true}, //
    // lastLoginDate: {type: Date, index: true},
    accessLevel: {type: Number, required: true, default: 10}

}, {collection: 'UsersDB'});


// // improve these methods!
// userSchema.methods.getUsername = function (done) {
//     var user = this;
//     return done(null, user.username);
// };
//
// userSchema.methods.verifyPassword = function (password, done) {
//     var user = this;
//
//     var hash = crypto.createHmac('sha512', user.salt);
//     hash.update(password);
//     var digestedPW = hash.digest('base64');
//     return (user.saltedHash === digestedPW) ? done(null, user) : done(new Error('Incorrect password.'), null);
// };
//
// userSchema.methods.getAccessLevel = function (done) {
//     var user = this;
//     return done(null, user.accessLevel);
// };


module.exports = mongoose.model('User', userSchema);
