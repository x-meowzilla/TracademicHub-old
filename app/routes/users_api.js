var router = require('express').Router();
var mw = require('../modules/middlewares');
var util = require('../modules/utility');
var UserModel = require('../db_models/User');

// users URI: .../api/users/
router.get('/', mw.checkAuthentication, function (req, res) {
    UserModel.getAllUsers()
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

router.get('/:id', function (req, res) { // can be utorid or userID
    // play a little trick here. UTORid max length = 8, user id max length = 24
    return (req.params.id.length > 12) ? findByUserID(req.params.id) : findByUTORID(req.params.id);

    function findByUserID(userID) {
        UserModel.findById(userID)
            .then(function (user) {
                return res.json(util.retrieveBasicUserData(user)).end();
            })
            .catch(function (error) {
                return res.status(500).end(error.errmsg);
            });
    }

    function findByUTORID(utorid) {
        UserModel.findByUTORID(utorid)
            .then(function (user) {
                return res.json(util.retrieveBasicUserData(user)).end();
            })
            .catch(function (error) {
                return res.status(500).end(error.errmsg);
            });
    }
});

router.post('/', function (req, res) {
    res.send('POST request accepted.');
});

router.patch('/:userID/privilege/:accessID', function (req, res) {
    UserModel.findByIdAndUpdate(req.params.userID, {$set: {accessLevel: req.params.accessID}}, {new: true})
        .then(function (user) {
            console.log(user);
            res.json(user);
            // TODO
        })
        .catch(function (error) {
            return res.status(500).end(error.errmsg);
        });
});

// router.delete('/', function (req, res) {
//     res.send('DELETE!! delete all entries');
// });
//
// router.delete('/:id', function (req, res) {
//     res.send('DELETE!! delete one entry');
// });


module.exports = router;
