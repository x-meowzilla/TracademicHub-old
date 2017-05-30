// var SamlStrategy = require('passport-saml').Strategy;
var LocalStrategy = require('passport-local').Strategy;
// var passportConfig = require('../configurations/passport_config');

var UsersModel = require('../db_models/User');

module.exports = function (passport) {

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        return done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        UsersModel.findById(id, function (error, user) {
            if (error) return done(error, null);

            return user ? done(null, user.toObject()) : done(new Error('User does not exist.'), null);
        });
    });

    // var samlStrategy = new SamlStrategy(passportConfig.samlData, function (req, profile, done) {
    //     console.log(profile);
    //     done(new Error('temp stop program for testing'), null);
    // });
    // passport.use(samlStrategy);

    // local strategy
    passport.use('local', new LocalStrategy({passReqToCallback: true}, function (req, username, password, done) {
        UsersModel.findOne({username: username}, function (error, user) {
            if (error) return done(error, null);
            else return done(null, user); // return the user regardless of existence of this user, handle status in router
        });
    }));

};
