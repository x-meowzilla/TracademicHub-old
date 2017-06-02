var router = require('express').Router();
var passport = require('passport');


router.get('/Login', function (req, res) {
    passport.authenticate('saml',
        {
            successRedirect: '/', // welcome page - can change to user management dashboard page
            failureRedirect: '/Shibboleth.sso/Login'
        },
        function (error, user) { // user guaranteed exists! check passport_authentication.js
            if (error) return res.status(500).end(error.errmsg);

            // set data to session and cookie
            res.session.user = user;
            res.cookie('userID', user._id);

            // if this user data has not been imported (name field exists), then redirect to update info page
            if (!user.name) res.redirect('/some-page-to-update-basic-user-info');
            return res.status(200).json(user).end();
        })(req, res);
});

router.post('/SAML2/POST',
    passport.authenticate('saml',
        {
            failureRedirect: '/Shibboleth.sso/Login',
            failureFlash: true
        }),
    function (req, res) {
        res.redirect('/');
    }
);

module.exports = router;
