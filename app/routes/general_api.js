var router = require('express').Router();
var passport = require('passport');
var serverConfig = require('../configurations/server_config');
var util = require('../modules/utility');
var UserModel = require('../db_models/User');
var PrivilegeModel = require('../db_models/AccessPrivilege');

// general API URI: .../api/
router.post('/local-login', _validateReqBodyUTORidAndPassword, function (req, res) {
    passport.authenticate('local', {session: true}, function (error, user) {
        if (error) {
            return res.status(error.errcode).end(error.errmsg);
        } else {
            req.login(user, function () {
                user.updateLastLoginDate();
                return res.json(util.retrieveBasicUserData(user)).end();
            });
        }
    })(req, res);
});

router.post('/local-register', _validateReqBodyUTORidAndPassword, _validateReqBodyFirstNameAndLastName, function (req, res) {
    UserModel.findByUTORID(req.body.utorid) // Note: utorid is the name field for all users.
        .then(function (user) {
            return user ? res.status(409).end('Username "' + user.utorid + '" already exists.') : createLocalUser();
        })
        .catch(function (error) {
            res.status(500).end(error.errmsg);
        });

    function createLocalUser() {
        PrivilegeModel.findByPrivilegeValueAndDescription(util.ACCESS_ADMIN, util.ACCESS_ADMIN_DESCRIPTION)
            .then(function (adminAccess) {
                return adminAccess._id;
            })
            .then(function (adminAccess) {
                var user = new UserModel();
                user.utorid = req.body.utorid;
                user.encryptPassword(req.body.password);
                user.setFullName(req.body.firstName, req.body.lastName);
                user.email = req.body.utorid + '-test@tracademichub.com'; // create a fake email address for now
                user.accessPrivilege = adminAccess;
                return user.save()
            })
            .then(function (user) {
                return res.json(util.retrieveBasicUserData(user)).end();
            })
            .catch(function (error) {
                res.status(500).end(error.errmsg);
            });
    }
});

router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    res.clearCookie(serverConfig.session.key, {path: '/'});
    // res.redirect('/'); // TODO - delete? refresh page?
    return res.status(200).end('Logout successful. Please close the browser to complete the logout process.');
});


function _validateReqBodyUTORidAndPassword(req, res, next) {
    var errmsg = null;
    if (!req.body.utorid)
        errmsg = 'Missing required field "utorid" in request body.';
    else if (!req.body.password)
        errmsg = 'Missing required field "password" in request body.';

    return errmsg ? res.status(400).end(errmsg) : next();
}

function _validateReqBodyFirstNameAndLastName(req, res, next) {
    var errmsg = null;
    if (!req.body.firstName)
        errmsg = 'Missing required field "firstName" in request body.';
    else if (!req.body.lastName)
        errmsg = 'Missing required field "lastName" in request body.';

    return errmsg ? res.status(400).end(errmsg) : next()
}

module.exports = router;
