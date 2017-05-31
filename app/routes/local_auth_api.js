var router = require('express').Router();
var passport = require('passport');
var UserModel = require('../db_models/User');

var crypto = require('crypto');

//router.put('/register', function (req, res) {
//    console.log(req.body);
//
//    UserModel.findOne({username: req.body.username}, function (error, user) {
//
//        if (error) return res.status(error.code).end(error);
//
//        if (user) {
//            return res.status(409).end('Username: "' + user.username + '" already exists.');
//        } else {
//
//            // var newUser = new UserModel();
//            // newUser.username = req.body.username;
//            // newUser.password = req.body.password;
//            // newUser.accessLevel = 50; // change it later, now admin level
//            //
//            // newUser.save(function (error, result) {
//            //
//            //     console.log(error, result);
//            //
//            // });
//
//            var newUser = new UserModel({
//                username: req.body.username,
//                password: req.body.password,
//                accessLevel: 50
//            });
//
//            newUser.save(function (error) {
//                if (error) return res.status(error.code).end(error);
//                else return res.end('Create User: "' + newUser.username + '".');
//            });
//        }
//    });
//});

router.post('/register', function (req, res) {
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({
                status: 400,
                message: "Create user failed: Missing userName and/or password in request"
            });
        }
    UserModel.findOne({username: req.body.username}, function (error, user) {

        if (error) return res.status(error.code).end(error);

        if (user) {
            return res.status(409).end('Username: "' + user.username + '" already exists.');
        } else {
            // create salt and hash to encrypt the password
            var salt = crypto.randomBytes(16).toString('base64');
            var hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64');
            var newUser = new UserModel({
                username: req.body.username,
                salt: salt,
                hash: hash,
                accessLevel: 50
            });

            newUser.save(function (error) {
                if (error) return console.log(error);
                else return res.end('Create User: "' + newUser.username + '".');
            });
        }
    });
});

router.post('/login', function (req, res) {
    console.log(req.body);
    passport.authenticate('local',
        {
            successRedirect: '/',
            failureRedirect: '/login/fail'
        },
        function (error, user) {
            if (error) return res.status(error.code).end(error);

            if (!user) {
                return res.status(404).end('User: "' + req.body.username + '" does not exist.');
            } else if (!user.verifyPassword(req.body.password)) {
                return res.status(401).end('Incorrect Password.');
            } else {
                req.session.user = user;
                res.cookie('userID', user._id);
                return res.status(200).json(user).end();
            }
        })(req, res);
});

router.get('/login/fail', function (req, res) {
    return res.status(401).end('Login failed.');
});

router.get('/logout', function (req, res) {
    req.logout();
    return res.status(200).end('Logout successful.');
});


module.exports = router;
