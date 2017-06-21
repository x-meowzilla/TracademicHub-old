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

router.get('/:id', checkAuthentication, function (req, res) {
    res.send('GET request accepted, ID: ' + req.params.id);
});

router.get('/:id/history', checkAuthentication, function (req, res) {
    res.send('GET history');
});

router.post('/', checkAuthentication, function (req, res) {
    res.send('POST request accepted.');
});

// TODO - POST may not be the best method here, put? find method for update
router.post('/:id/adjustPrivileges', checkAuthentication, function (req, res) {
    var userID = req.params.id;
    UserModel.findByID(userID, function (error, user) {
        if (error) return res.status(500).end(error.errmsg);

        if (!user) {
            return res.status(404).end('User not found.');
        } else {
            var accessLevel = Number(req.body.accessLevel);
            // TODO - adjust user priviledges, try to use promise to avoid callbacks
        }
    });
});

router.delete('/', checkAuthentication, function (req, res) {
    res.send('DELETE!! delete all entries');
});

router.delete('/:id', checkAuthentication, function (req, res) {
    res.send('DELETE!! delete one entry');
});

router.delete('/logout', function (req, res) {
    req.logout();
    res.clearCookie('userID');
    res.redirect('/');
    return res.status(200).end('Logout successful.');
});


module.exports = router;
