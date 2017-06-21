var router = require('express').Router();
var mw = require('../modules/middlewares');
var UserModel = require('../db_models/User');

// users URI: .../api/users/
router.get('/', mw.checkAuthentication, function (req, res) {
    UserModel.getAllUsers()
        .then(function (userArray) {
            var resultArray = userArray.map(function (user) {
                return {
                    _id: user._id,
                    utorid: user.utorid,
                    email: user.email,
                    name: user.name,
                    studentNumber: user.studentNumber,
                    accessLevel: user.accessLevel
                }
            });
            return res.json(resultArray).end();
        })
        .catch(function (error) {
            return res.status(500).end(error.errmsg);
        });
});

router.get('/:userID', function (req, res) {
    UserModel.findById(req.params.userID)
        .then(function (user) {
            var resultUser = {
                _id: user._id,
                utorid: user.utorid,
                email: user.email,
                name: user.name,
                studentNumber: user.studentNumber,
                accessLevel: user.accessLevel
            };
            return res.json(resultUser).end();
        })
        .catch(function (error) {
            return res.status(500).end(error.errmsg);
        });
});

router.get('/utorid/:utorid', function (req, res) { // may not needed
    UserModel.findByUTORID(req.params.utorid)
        .then(function (user) {
            var resultUser = {
                _id: user._id,
                utorid: user.utorid,
                email: user.email,
                name: user.name,
                studentNumber: user.studentNumber,
                accessLevel: user.accessLevel
            };
            return res.json(resultUser).end();
        })
        .catch(function (error) {
            return res.status(500).end(error.errmsg);
        });
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

router.delete('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
    return res.status(200).end('Logout successful.');
});


module.exports = router;
