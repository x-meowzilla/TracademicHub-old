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

router.get('/Login/callback',
    passport.authenticate('saml', {
        successRedirect: '/',
        failureRedirect: '/Shibboleth.sso/Login'
    }),
    function (req, res) {
        res.end('not implemented yet.')
    }
);

module.exports = router;