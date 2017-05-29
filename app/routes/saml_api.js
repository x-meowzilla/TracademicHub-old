var router = require('express').Router();
var passport = require('passport');

// router.get('/status', function (req, res) {
//     res.send('looking good');
// });

router.get('/Login',
    passport.authenticate('saml', {
        successRedirect: '/', // homepage
        failureRedirect: '/Shibboleth.sso/Login' //
    })
);

module.exports = router;