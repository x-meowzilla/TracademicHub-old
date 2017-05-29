var passport = require('passport');
// var SamlStrategy = require('passport-saml').Strategy;
var LocalStrategy = require('passport-local').Strategy;
// var passportConfig = require('../configurations/passport_config');

var dbModel = require('../db_models/User');

module.exports = function (app) {

    app.use(passport.initialize());
    app.use(passport.session());

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


    // var samlStrategy = new SamlStrategy(passportConfig.samlData, function (req, profile, done) {
    //     console.log(profile);
    //     done(new Error('temp stop program for testing'), null);
    // });
    // passport.use(samlStrategy);

    // local strategy
    var localStrategy = new LocalStrategy({passReqToCallback: true}, function (username, password, done) {
        // TODO - save local user to db?

        console.log('local');

        dbModel.LocalUser.findOne({username: username}, function (error, user) {

            console.log('local db');

            console.log(error);
            console.log(user);

            done(null, 'good');


            // // return error message if error exists
            // if (error) return callback(error, null);
            //
            // if (!user) return callback(null, null);
            // else return callback(null, user);
        })
    });
    passport.use(localStrategy);

};
