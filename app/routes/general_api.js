var router = require('express').Router();
var passport = require('passport');
var serverConfig = require('../configurations/server_config');
var util = require('../modules/utility');
var UserModel = require('../db_models/User');

// general API URI: .../api/
router.post('/local-login', _validateReqBodyUTORidAndPassword, function (req, res) {
    passport.authenticate('local', {session: true}, function (error, user) {
        if (error) {
            return res.status(error.code).send(error.message).end();
        } else {
            req.login(user, function () {
                return res.json(util.retrieveBasicUserData(user)).end();
            });
        }
    })(req, res);
});

router.put('/local-register', _validateReqBodyUTORidAndPassword, _validateReqBodyFirstNameAndLastName, function (req, res) {
    UserModel.findUserData({utorid: req.body.utorid}) // Note: utorid is the name field for all users.
        .then(function (userArray) {
            return userArray.length !== 0 ? res.status(409).send('Username "' + userArray[0].utorid + '" already exists.').end() : createLocalUser();
        })
        .catch(function (error) {
            return res.status(500).send(error).end();
        });

    function createLocalUser() {
        var user = new UserModel();
        user.utorid = req.body.utorid;
        user.encryptPassword(req.body.password);
        user.setLegalName(req.body.firstName, req.body.lastName, req.body.preferredName);
        user.email = req.body.utorid + '-test@tracademic.utsc.utoronto.ca'; // create a fake email address for now
        user.save()
            .then(function (user) {
                return res.json(user).end();
            })
            .catch(function (error) {
                res.status(500).send(error).end();
            });
    }
});

router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    res.clearCookie(serverConfig.session.key);
    return res.status(200).send('Logout successful. Please close the browser to complete the logout process.').end();
});


function _validateReqBodyUTORidAndPassword(req, res, next) {
    var errmsg = null;
    if (!req.body.utorid)
        errmsg = 'Missing required field "utorid" in request body.';
    else if (!req.body.password)
        errmsg = 'Missing required field "password" in request body.';
    return errmsg ? res.status(400).send(errmsg).end() : next();
}

function _validateReqBodyFirstNameAndLastName(req, res, next) {
    var errmsg = null;
    if (!req.body.firstName)
        errmsg = 'Missing required field "firstName" in request body.';
    else if (!req.body.lastName)
        errmsg = 'Missing required field "lastName" in request body.';
    return errmsg ? res.status(400).send(errmsg).end() : next();
}

module.exports = router;
