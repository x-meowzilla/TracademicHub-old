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
        UserModel.findByUTORID(utorid)
            .then(function (user) {
                // if a student is late to register for the course, but student data is already imported,
                // the student can still login via UofT login but we won't find any entry from our database,
                // so we automatically create an empty user entry and let student fill out rest of the data
                return user ? done(null, user) : createUser(done);
            })
            .catch(function (error) {
                return done(error, false);
            });

        function createUser(done) {
            var user = new UserModel({utorid: utorid, email: email});
            user.save()
                .then(function (user) {
                    return done(null, user);
                })
                .catch(function (error) {
                    return done(error, false);
                });
        }
    }));

    // local strategy
    passport.use('local', new LocalStrategy({usernameField: 'utorid'}, function (utorid, password, done) {
        UserModel.findByUTORID(utorid)
            .then(function (user) {
                if (!user)
                    return {error: {errcode: 404, errmsg: 'Login failed. Username "' + utorid + '" does not exist.'}, user: false};
                if (!user.verifyPassword(password))
                    return {error: {errcode: 401, errmsg: 'Login failed. Incorrect Password.'}, user: false};
                else
                    return {error: null, user: user};
            })
            .then(function (result) {
                return done(result.error, result.user);
            })
            .catch(function (error) {
                return done(error, false);
            });
    }));

};
