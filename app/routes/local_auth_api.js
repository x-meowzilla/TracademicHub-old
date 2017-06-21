var router = require('express').Router();
var passport = require('passport');
var serverConfig = require('../configurations/server_config');
var access = require('../modules/access_level');
var UserModel = require('../db_models/User');
var AccessLevelModule = require('../db_models/AccessLevel');

// local user URI: .../api/local/users/
router.post('/register', function (req, res) {
    UserModel.findByUTORID(req.body.utorid) // find admin username (utorid is the primary key in the database)
        .then(function (user) {
            return user ? res.status(409).end('User: "' + user.utorid + '" already exists.') : createLocalUser();
        })
        .catch(function (error) {
            res.status(500).end(error.errmsg);
        });

    function createLocalUser() {
        AccessLevelModule.findByAccessLevelAndDescription(access.ACCESS_LEVEL_ADMIN, access.ACCESS_LEVEL_ADMIN_DESCRIPTION)
            .then(function (adminAccess) {
                return adminAccess._id;
            })
            .then(function (adminAccess) {
                var user = new UserModel();
                user.utorid = req.body.utorid;
                user.encryptPassword(req.body.password);
                user.email = req.body.utorid + '@test-tracademic.com'; // create a fake email address for now
                user.accessLevel = adminAccess;
                return user
            })
            .then(function (resultUser) {
                resultUser.save()
                    .then(function (user) {
                        var userData = {
                            _id: user._id,
                            utorid: user.utorid,
                            email: user.email,
                            name: user.name,
                            accessLevel: user.accessLevel,
                            createDate: user.createDate
                        };
                        return res.json(userData).end();
                    });
            })
            .catch(function (error) {
                res.status(500).end(error.errmsg);
            });
    }
});

router.post('/login', function (req, res) {
    passport.authenticate('local', {session: true}, function (error, user) {
        if (error) {
            return res.status(error.errcode).end(error.errmsg);
        } else {
            req.login(user, function () {
                var userData = {
                    _id: user._id,
                    utorid: user.utorid,
                    email: user.email,
                    name: user.name,
                    accessLevel: user.accessLevel
                }; // for login, only return the data we need.
                return res.json(userData).end();
            });
        }
    })(req, res);
});


module.exports = router;
