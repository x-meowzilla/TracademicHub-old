module.exports.checkAuthentication = function (req, res, next) {
    "use strict";

    if (!req.isAuthenticated())
        return res.status(401).send('Please login before performing this action.').end('Unauthorized');
    else
        return next();
};

module.exports.checkAccessPrivilege = function (req, res, next) {
    "use strict";

    // TODO - find a way to compare access privilege

    return next();
};
