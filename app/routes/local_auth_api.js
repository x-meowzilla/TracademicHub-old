var router = require('express').Router();
var passport = require('passport');
var UserModel = require('../db_models/User');


// only for local user
router.post('/register', function (req, res) {
    // use promise instead of callbacks
    UserModel.findOne({utorid: req.body.utorid})
        .then(function (user) {
            if (user) {
                return res.status(409).end('Username: "' + user.utorid + '" already exists.');
            } else {
                // user does not exist, create new user and save to database
                user = new UserModel();
                user.utorid = req.body.utorid;
                user.encryptPassword(req.body.password);
                user.firstName = req.body.firstName;
                user.lastName = req.body.lastName;

                // use promise in mongodb to avoid massive callbacks
                user.save()
                    .then(function (user) {
                        return res.status(200).json(user).end();
                    })
                    .catch(function (error) {
                        return res.status(error.code).end(error);
                    });
            }
        })
        .catch(function (error) {
            return res.status(error.code).end(error);
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
                return res.status(404).end('User: "' + req.body.utorid + '" does not exist.');
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
    return res.redirect('/').status(200).end('Logout successful.');
});


module.exports = router;
