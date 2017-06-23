module.exports.checkAuthentication = function (req, res, next) {
    "use strict";

    if (!req.isAuthenticated())
        return res.status(401).send('Please login before performing this action.').end('Unauthorized');
    else
        return next();
};

module.exports.haveTAAccessPrivilege = function (req, res, next) {
    "use strict";

    console.log('=====mw - TA=====', req.user.accessPrivilege);
    return next();
};

module.exports.haveInstructorAccessPrivilege = function (req, res, next) {
    "use strict";

    console.log('=====mw - Instructor=====', req.user.accessPrivilege);
    return next();
};

module.exports.haveAdminAccessPrivilege = function (req, res, next) {
    "use strict";

    console.log('=====mw - Admin=====', req.user.accessPrivilege);
    return next();
};
