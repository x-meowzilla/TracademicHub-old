var router = require('express').Router();
var passport = require('passport');
var UserModel = require('../db_models/User');


// only for local user
router.post('/register', function (req, res) {
    UserModel.findOne({username: req.body.username}, function (error, user) {

        if (error) return res.status(error.code).end(error);

        if (user) {
            return res.status(409).end('Username: "' + user.username + '" already exists.');
        } else {
            // user does not exist, create new user and save to database
            user = new UserModel();
            user.username = req.body.username;
            user.encryptPassword(req.body.password);
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;

            // use promise in mongodb to avoid massive callbacks
            user.save()
                .then(function (user) {
                    console.log(user.toObject());
                    return res.status(200).json(user).end();
                })
                .catch(function (error) {
                    return res.status(error.code).end(error);
                });
        }
    });
});

router.post('/login', function (req, res) {
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
