var PrivilegeModel = require('../db_models/AccessPrivilege');
var UserModel = require('../db_models/User');
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


module.exports.haveAuthority = function (req, res, next) {
    // TODO - still under construction
    // Note: when calling this middleware function, target user id: req.params.userID must present!!
    var targetUserID = req.params.userID;

    UserModel.findById(targetUserID)
        .then(function (targetUser) {
            return targetUser.accessPrivilege;
        })
        .then(function (targetUserAccessID) {
            console.log('====2=====', req.user.accessPrivilege);
            console.log('====2=====', targetUserAccessID);

            return PrivilegeModel.findTest(req.user.accessPrivilege, targetUserAccessID);
        })
        .then(function (array) {
            console.log('====3=====', array);

            next();
        })
        .catch(function (error) {
            return res.status(500).end(error.errmsg);
        })
};


function noPrivilegeError(accessDescription) {
    var errmsg = 'Permission denied. You must have ';
    if (accessDescription !== util.ACCESS_ADMIN_DESCRIPTION) errmsg += 'at least ';
    return errmsg + accessDescription.toUpperCase() + ' access privilege to perform this action.';
}

function noAuthorityError() {

}
