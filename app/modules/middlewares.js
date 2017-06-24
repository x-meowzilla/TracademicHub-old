var PrivilegeModel = require('../db_models/AccessPrivilege');
var util = require('./utility');

module.exports.checkAuthentication = function (req, res, next) {
    "use strict";

    if (!req.isAuthenticated())
        return res.status(401).send('Please login before performing this action.').end('Unauthorized');
    else
        return next();
};

module.exports.haveMinimumTAAccessPrivilege = function (req, res, next) {
    "use strict";

    PrivilegeModel.findById(req.user.accessPrivilege)
        .then(function (userAccess) {
            if (userAccess.value < util.ACCESS_TA)
                return res.status(403).send(noPrivilegeError(util.ACCESS_TA_DESCRIPTION)).end('Forbidden');
            else
                return next()
        })
        .catch(function (error) {
            return res.status(500).end(error.errmsg);
        });
};

module.exports.haveMinimumInstructorAccessPrivilege = function (req, res, next) {
    "use strict";

    PrivilegeModel.findById(req.user.accessPrivilege)
        .then(function (userAccess) {
            if (userAccess.value < util.ACCESS_INSTRUCTOR)
                return res.status(403).send(noPrivilegeError(util.ACCESS_INSTRUCTOR_DESCRIPTION)).end('Forbidden');
            else
                return next()
        })
        .catch(function (error) {
            return res.status(500).end(error.errmsg);
        });

};

module.exports.haveMinimumAdminAccessPrivilege = function (req, res, next) {
    "use strict";

    PrivilegeModel.findById(req.user.accessPrivilege)
        .then(function (userAccess) {
            if (userAccess.value !== util.ACCESS_ADMIN)
                return res.status(403).send(noPrivilegeError(util.ACCESS_ADMIN_DESCRIPTION)).end('Forbidden');
            else
                return next()
        })
        .catch(function (error) {
            return res.status(500).end(error.errmsg);
        });
};


function noPrivilegeError(accessDescription) {
    var errmsg = 'Permission denied. You must have ';
    if (accessDescription !== util.ACCESS_ADMIN_DESCRIPTION) errmsg += 'at least ';
    return errmsg + accessDescription.toUpperCase() + ' access privilege to perform this action.';
}
