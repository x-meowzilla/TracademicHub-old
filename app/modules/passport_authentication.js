var LocalStrategy = require('passport-local').Strategy;
var SamlStrategy = require('passport-saml').Strategy;
var passportConfig = require('../configurations/passport_config');

var UserModel = require('../db_models/User');

module.exports = function (passport) {

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        return done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        UserModel.findById(id, function (error, user) {
            return done(error, user);
        });
    });

    // saml strategy
    passport.use('saml', new SamlStrategy(passportConfig.samlData, function (profile, done) {
        var utorid = profile['urn:oid:1.3.6.1.4.1.15465.3.1.8'];
        var email = profile['urn:oid:0.9.2342.19200300.100.1.3'];
        UserModel.findOne({utorid: utorid})
            .then(function (user) {
                // if a student is late to register for the course, but student data is already imported,
                // the student can still login via UofT login but we won't find any entry from our database,
                // so we automatically create an empty user entry and let student fill out rest of the data
                if (user) {
                    return done(null, user);
                } else {
                    user = new UserModel({utorid: utorid, email: email});
                    user.save()
                        .then(function (user) {
                            return res.status(200).json(user).end();
                        })
                        .catch(function (error) {
                            return res.status(500).end(error.errmsg);
                        });
                }
            })
            .catch(function (error) {
                return done(error, false);
            });
    }));

    // local strategy
    passport.use('local', new LocalStrategy({usernameField: 'utorid'}, function (utorid, password, done) {
        UserModel.findOne({utorid: utorid})
            .then(function (user) {
                return done(null, user);  // return the user regardless of existence of this user, handle status in router
            })
            .catch(function (error) {
                return done(error, false);
            });
    }));

};
