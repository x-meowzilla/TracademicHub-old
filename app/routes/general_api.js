var router = require('express').Router();

router.get('/api/logout', function (req, res) {
    req.logout();
    res.redirect('/'); // TODO - delete? refresh page?
    return res.status(200).end('Logout successful.');
});


module.exports = router;
