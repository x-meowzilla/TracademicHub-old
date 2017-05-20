var passport = require('passport');
var SamlStrategy = require('passport-saml').Strategy;
var passportConfig = require('./configurations/passport_config');

module.exports = function (app) {

    // https://github.com/ritstudentgovernment/passport-saml-example/blob/master/app.js
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    // ----- this part from the web app, select one to use -----
    // passport.serializeUser(function(user, done) {
    //     done(null, user._id);
    // });
    // passport.deserializeUser(function(id, done) {
    //     UserModel.findById(id, function(err, user) {
    //         if (err)
    //             return done(err, false);
    //         if(user)
    //             return done(null, user.toObject());
    //         else
    //             return done(new Error("User not found"), false);
    //     });
    // });


    var samlStrategy = new SamlStrategy(passportConfig.samlData, function (req, profile, done) {
        console.log(profile);
        done(new Error('temp stop program for testing'), null);
    });
    passport.use(samlStrategy);

    app.use(passport.initialize());
    app.use(session());

};
