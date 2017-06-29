var router = require('express').Router();
var mw = require('../modules/middlewares');
var util = require('../modules/utility');
var UserModel = require('../db_models/User');

// users URI: .../api/users/
router.get('/', mw.checkAuthentication, mw.haveMinimumTAAccessPrivilege, function (req, res) {
    "use strict";
    var findDoc = {};
    for (var arg in req.query) {
        switch (arg) {
            case '_id':
            case 'utorid':
            case 'email':
            case 'studentNumber':
            case 'accessPrivilege':
            case 'isActive':
                findDoc[arg] = req.query[arg];
                break;
            case 'firstName':
            case 'lastName':
            case 'preferredName':
                findDoc['name.' + arg] = req.query[arg];
                break;
        }
    }

    UserModel.findUserData(findDoc)
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

router.patch('/:userID/update/user-info', mw.checkAuthentication, function (req, res) {
    "use strict";
    var updateDoc = {};
    for (var arg in req.query) {
        switch (arg) {
            case 'firstName':
            case 'lastName':
            case 'preferredName':
                updateDoc['name.' + arg] = req.query[arg];
                break;
            case 'biography':
                updateDoc[arg] = req.query[arg];
                break;
        }
    }

    UserModel.updateUserData(req.params.userID, updateDoc)
        .then(function (user) {
            return res.json(util.retrieveBasicUserData(user)).end();
        })
        .catch(function (error) {
            return res.status(500).end(error.errmsg);
        });
});

router.patch('/:userID/update/user-access', mw.checkAuthentication, mw.haveMinimumInstructorAccessPrivilege, mw.haveAuthority, function (req, res) {
    "use strict";
    var updateDoc = {};
    for (var arg in req.query) {
        switch (arg) {
            case 'accessPrivilege':
            case 'isActive':
                updateDoc[arg] = req.query[arg];
                break;
        }
    }

    UserModel.updateUserData(req.params.userID, updateDoc)
        .then(function (user) {
            return res.json(util.retrieveBasicUserData(user)).end();
        })
        .catch(function (error) {
            return res.status(500).end(error.errmsg);
        });
});

// router.patch('/deactivate/', mw.checkAuthentication, mw.haveMinimumInstructorAccessPrivilege, function (req, res) {
//     UserModel.deactivateUsers()
//         .then(function (user) {
//             return res.json(util.retrieveBasicUserData(user)).end();
//         })
//         .catch(function (error) {
//             return res.status(500).end(error.errmsg);
//         });
// });


module.exports = router;
