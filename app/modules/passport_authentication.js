var LocalStrategy = require('passport-local').Strategy;
var SamlStrategy = require('passport-saml').Strategy;
var passportConfig = require('../configurations/passport_config');

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

    // saml strategy
    // TODO - get ready for the config data
    passport.use('saml', new SamlStrategy(config_data), function (profile, done) {
        var utorid = profile['urn:oid:1.3.6.1.4.1.15465.3.1.8'];
        var email = profile['urn:oid:0.9.2342.19200300.100.1.3'];
        UserModel.findOne({utorid: utorid})
            .then(function (user) {
                return done(null, user); // return the user regardless of existence of this user, handle status in router
            })
            .catch(function (error) {
                return done(error, false);
            });
    });

    // local strategy
    passport.use('local', new LocalStrategy({usernameField: 'utorid'}, function (utorid, password, done) {
        UsersModel.findOne({utorid: utorid})
            .then(function (user) {
                return done(null, user);  // return the user regardless of existence of this user, handle status in router
            })
            .catch(function (error) {
                return done(error, false);
            });
    }));

};
