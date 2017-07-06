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
        UserModel.findUserData({utorid: utorid, email: email})
            .then(function (userArray) {
                if (userArray.length === 0)
                    return {error: {code: 404, message: 'Login failed. UTORid \'' + utorid + '\' not enrolled in this course.'}, user: false};
                else
                    return {error: null, user: userArray[0]};
            })
            .then(function (result) {
                return result.error ? done(result.error, result.user) : updateLoginDateAndReturnUserData(result.user, done);
            })
            .catch(function (error) {
                return done(error, false);
            });
    }));

    // local strategy
    passport.use('local', new LocalStrategy({usernameField: 'utorid'}, function (utorid, password, done) {
        UserModel.findUserData({utorid: utorid})
            .then(function (userArray) {
                if (userArray.length === 0)
                    return {error: {code: 404, message: 'Login failed. Username "' + utorid + '" does not exist.'}, user: false};
                if (!userArray[0].verifyPassword(password))
                    return {error: {code: 401, message: 'Login failed. Incorrect Password.'}, user: false};
                else
                    return {error: null, user: userArray[0]};
            })
            .then(function (result) {
                return result.error ? done(result.error, result.user) : updateLoginDateAndReturnUserData(result.user, done);
            })
            .catch(function (error) {
                return done(error, false);
            });
    }));

    function updateLoginDateAndReturnUserData(user, done) {
        user.updateLastLoginDate()
            .then(function (user) {
                return done(null, user);
            })
            .catch(function (error) {
                return done(error, false);
            });
    }
};
