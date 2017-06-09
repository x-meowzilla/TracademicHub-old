var router = require('express').Router();
var passport = require('passport');
var UserModel = require('../db_models/User');


// only for local user
router.post('/register', function (req, res) {
    // use promise instead of callbacks
    UserModel.findOne({utorid: req.body.utorid})
        .then(function (user) {
            if (user) {
                return res.status(409).end('User: "' + user.utorid + '" already exists.');
            } else {
                // user does not exist, create new user and save to database
                user = new UserModel();
                user.utorid = req.body.utorid;
                user.encryptPassword(req.body.password);
                user.email = req.body.utorid + '@test-tracademic.com'; // create a fake email address for now

                // use promise in mongodb to avoid massive callbacks
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
            return res.status(500).end(error.errmsg);
        });
});

router.post('/login', function (req, res) {
    passport.authenticate('local',
        {
            successRedirect: '/',
            failureRedirect: '/'
        },
        function (error, user) {
            if (error) return res.status(500).end(error.errmsg);

            if (!user) {
                return res.status(404).end('User: "' + req.body.utorid + '" does not exist.');
            } else if (!user.verifyPassword(req.body.password)) {
                return res.status(401).end('Incorrect Password.');
            } else {
                req.session.user = user;
                res.cookie('userID', user._id);
                var userData = {
                    _id: user._id,
                    utorid: user.utorid,
                    email: user.email,
                    name: user.name,
                    accessLevel: user.accessLevel
                }; // for login, only return the data we need.
                return res.status(200).json(userData).end();
            }
        })(req, res);
});


module.exports = router;
