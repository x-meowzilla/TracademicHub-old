var router = require('express').Router();
var mw = require('../modules/middlewares');
var util = require('../modules/utility');
var UserModel = require('../db_models/User');

// users URI: .../api/users/
router.get('/', mw.checkAuthentication, mw.haveMinimumTAAccessPrivilege, function (req, res) {
    UserModel.find({})
        .then(function (userArray) {
            var resultArray = userArray.map(function (user) {
                return util.retrieveBasicUserData(user);
            });
            return res.json(resultArray).end();
        })
        .catch(function (error) {
            return res.status(500).end(error.errmsg);
        });
});

router.get('/:userID', mw.checkAuthentication, mw.haveMinimumTAAccessPrivilege, function (req, res) {
    UserModel.findById(req.params.userID)
        .then(function (user) {
            return res.json(util.retrieveBasicUserData(user)).end();
        })
        .catch(function (error) {
            return res.status(500).end(error.errmsg);
        });
});

router.get('/privilege/:accessID', mw.checkAuthentication, mw.haveMinimumInstructorAccessPrivilege, function (req, res) {
    // get users by access privilege
    UserModel.findByAccessPrivilege(req.params.accessID)
        .then(function (userArray) {
            var resultArray = userArray.map(function (user) {
                return util.retrieveBasicUserData(user);
            });
            return res.json(resultArray).end();
        })
        .catch(function (error) {
            return res.status(500).end(error.errmsg);
        });
});

router.post('/', function (req, res) {
    res.send('POST request accepted.');
});

router.post('/:userID/avatar', function (req, res) {

});

router.patch('/:userID/privilege/:accessID', mw.checkAuthentication, mw.haveMinimumInstructorAccessPrivilege, mw.haveAuthority, function (req, res) {
    UserModel.adjustAccessPrivilege(req.params.userID, req.params.accessID)
        .then(function (user) {
            return res.json(util.retrieveBasicUserData(user)).end();
        })
        .catch(function (error) {
            return res.status(500).end(error.errmsg);
        });
});

router.patch('/deactivate/', mw.checkAuthentication, mw.haveMinimumInstructorAccessPrivilege, function (req, res) {
    UserModel.deactivateUsers()
        .then(function (user) {
            return res.json(util.retrieveBasicUserData(user)).end();
        })
        .catch(function (error) {
            return res.status(500).end(error.errmsg);
        });
});

router.patch('/:userID/activate/', mw.checkAuthentication, mw.haveMinimumInstructorAccessPrivilege, mw.haveAuthority, function (req, res) {
    UserModel.activateUserById(req.params.userID)
        .then(function (user) {
            return res.json(util.retrieveBasicUserData(user)).end();
        })
        .catch(function (error) {
            return res.status(500).end(error.errmsg);
        });
});

router.patch('/:userID/deactivate/', mw.checkAuthentication, mw.haveMinimumInstructorAccessPrivilege, mw.haveAuthority, function (req, res) {
    UserModel.deactivateUserById(req.params.userID)
        .then(function (user) {
            return res.json(util.retrieveBasicUserData(user)).end();
        })
        .catch(function (error) {
            return res.status(500).end(error.errmsg);
        });
});


module.exports = router;
