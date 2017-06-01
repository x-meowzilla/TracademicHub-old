// var SamlStrategy = require('passport-saml').Strategy;
var LocalStrategy = require('passport-local').Strategy;
// var passportConfig = require('../configurations/passport_config');

var UsersModel = require('../db_models/User');

module.exports = function (passport) {

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        return done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        UsersModel.findById(id, function (error, user) {
            return done(error, user);
        });
    });

    // var samlStrategy = new SamlStrategy(passportConfig.samlData, function (req, profile, done) {
    //     console.log(profile);
    //     done(new Error('temp stop program for testing'), null);
    // });
    // passport.use(samlStrategy);

    // local strategy
    passport.use('local', new LocalStrategy({usernameField: 'utorid'}, function (utorid, password, done) {
        UsersModel.findOne({utorid: utorid})
            .then(function (user) {
                return done(null, user);  // return the user regardless of existence of this user, handle status in router
            })
            .catch(function (error) {
                return done(error, null);
            });
    }));

};
