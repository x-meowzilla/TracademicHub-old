var router = require('express').Router();
var dbModel = require('../db_models/User');

var checkAuthentication = function (req, res, next) {
    var user = req.session.user;

    if (user) {
        if (!res.cookie.user) res.cookie('user', user, {secure: true, sameSite: true, httpOnly: true});
        else next();
    } else {
        res.clearCookie('user');
        res.status(401).send('Please login.').end("Unauthorized");
    }
};

// users API
router.get('/', checkAuthentication, function (req, res) {
    console.log(req.session);
    res.send('GET request accepted.');
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

router.post('/:id/adjustPrivileges', function (req, res) {
    var userID = req.params.id;
    dbModel.findByID(userID, function (error, user) {
        if (error) return res.status(500).end(error);

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


module.exports = router;
