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
    "use strict";
    // Note: when calling this middleware function, target user id: req.params.userID must present!!
    if (!req.params.userID) return res.status(400).send('Missing required field "userID" in URI.').end('Bad Request');

    UserModel.findById(req.params.userID) // find target user access privilege
        .then(function (targetUser) {
            if (req.user._id.equals(targetUser._id)) // cannot perform self upgrade/downgrade
                return res.status(400).send('You cannot perform this action for yourself.').end('Bad Request');
            else // if both users have same access privilege, then continue, if not deep check privilege value
                return (targetUser.accessPrivilege.equals(req.user.accessPrivilege)) ? next() : deepPrivilegeCheck(req.user.accessPrivilege, targetUser.accessPrivilege);
        })
        .catch(function (error) {
            return res.status(500).end(error.errmsg + ">>> have authority catch 1");
        });

    function deepPrivilegeCheck(reqUserAccessID, targetUserAccessID) {
        PrivilegeModel.findByIds(reqUserAccessID, targetUserAccessID)
            .then(function (array) {
                // access privilege array must contain 2 objects
                var reqUserAccessValue = null;
                var targetUserAccessValue = null;
                // compare the access privilege id to identify the value
                if (array[0]._id === reqUserAccessID) {
                    reqUserAccessValue = array[0].value;
                    targetUserAccessValue = array[1].value;
                } else {
                    reqUserAccessValue = array[1].value;
                    targetUserAccessValue = array[0].value;
                }
                return (reqUserAccessValue < targetUserAccessValue) ? res.status(403).send(noAuthorityError()).end('Forbidden') : next();
            })
            .catch(function (error) {
                return res.status(500).end(error.errmsg + ">>> have authority catch 2");
            });
    }
};


function noPrivilegeError(accessDescription) {
    var errmsg = 'Permission denied. You must have ';
    if (accessDescription !== util.ACCESS_ADMIN_DESCRIPTION) errmsg += 'at least ';
    return errmsg + accessDescription.toUpperCase() + ' access privilege to perform this action.';
}

function noAuthorityError() {
    return 'Permission denied. Insufficient access privilege to perform this action. Target user has higher access privilege.';
}
