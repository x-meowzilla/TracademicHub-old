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

router.patch('/:userID/privilege/:accessID', mw.checkAuthentication, mw.haveMinimumInstructorAccessPrivilege, mw.haveAuthority, function (req, res) {
    UserModel.updateAccessPrivilege(req.params.userID, req.params.accessID)
        .then(function (user) {
            res.json(util.retrieveBasicUserData(user)).end();
        })
        .catch(function (error) {
            return res.status(500).end(error.errmsg);
        });
});

// router.delete('/', function (req, res) {
//     res.send('DELETE!! delete all entries');
// });
//
router.delete('/:userID', mw.checkAuthentication, mw.haveMinimumInstructorAccessPrivilege, mw.haveAuthority, function (req, res) {

    // console.log(req);


    res.send('DELETE!! delete one entry');
});


module.exports = router;
