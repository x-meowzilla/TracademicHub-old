// var PrivilegeModel = require('../db_models/AccessPrivilege');
var UserModel = require('../db_models/User');
var util = require('./utility');

module.exports.sanitizeReqBodyHandler = function (req, res, next) {
    "use strict";

    Object.keys(req.body).forEach(function (arg) {
        req.sanitizeBody(arg).trim();
        req.sanitizeBody(arg).escape();
        switch (arg) {
            // user
            case 'utorid':
                req.checkBody(arg, 'UTORid must be alphanumeric characters').isAlphanumeric();
                break;
            case 'password':
                req.checkBody(arg, 'Password must be at least 6 characters long').isByteLength(6);
                break;
            case 'firstName':
                req.checkBody(arg, 'First name must be letters').isAlpha();
                break;
            case 'lastName':
                req.checkBody(arg, 'Last name must be letters').isAlpha();
                break;
            case 'preferredName':
            // point
            case 'assigneeID':
            case 'pointCategoryID':
            case 'pointValue':
            // point category
            case 'name':
            case 'description':
            // course
            case 'course':
                break;
        }
    });
    req.getValidationResult()
        .then(function (result) {
            if (result.isEmpty()) {
                return next()
            } else {
                var msgArray = [];
                result.array().forEach(function (error) {
                    msgArray.push(error.msg);
                });
                return res.status(400).json(msgArray.join(" & ")).end();
            }
        });
};

module.exports.sanitizeURIParamsHandler = function (req, res, next) {
    "use strict";

    Object.keys(req.params).forEach(function (arg) {
        req.sanitizeParams(arg).trim();
        req.sanitizeParams(arg).escape();
        switch (arg) {
            case 'userID':
                req.checkParams(arg, 'Invalid URI param element');
                break;
        }
    });
    req.getValidationResult()
        .then(function (result) {
            if (result.isEmpty()) {
                return next()
            } else {
                var msgArray = [];
                result.array().forEach(function (error) {
                    msgArray.push(error.msg);
                });
                return res.status(400).json(msgArray.join(" & ")).end();
            }
        });
};

module.exports.sanitizeQueryStringHandler = function (req, res, next) {
    "use strict";

    Object.keys(req.query).forEach(function (arg) {
        req.sanitizeQuery(arg).trim();
        req.sanitizeQuery(arg).escape();
        switch (arg) {
            // general
            case '_id':
            // user
            case 'utorid':
            case 'email':
            case 'studentNumber':
            case 'accessPrivilege':
            case 'isActive':
            case 'firstName':
            case 'lastName':
            case 'preferredName':
            case 'biography':
            // points
            case 'assignerID':
            case 'assigneeID':
            case 'grantDate':
            case 'value': // also in access privilege
            case 'categoryID':
            // point category
            case 'description': // also in access privilege
                req.checkQuery(arg, 'Invalid query string options');
                break;
        }
    });
    req.getValidationResult()
        .then(function (result) {
            if (result.isEmpty()) {
                return next()
            } else {
                var msgArray = [];
                result.array().forEach(function (error) {
                    msgArray.push(error.msg);
                });
                return res.status(400).json(msgArray.join(" & ")).end();
            }
        });
};

module.exports.checkAuthentication = function (req, res, next) {
    "use strict";

    if (!req.isAuthenticated())
        return res.status(401).send('Please login before performing this action.').end();
    else if (!req.user.isActive)
        return res.status(403).send('Permission denied. Your account is inactive. Please contact instructor to re-active your account.').end();
    else
        return next();
};

// module.exports.haveMinimumTAAccessPrivilege = function (req, res, next) {
//     "use strict";
//
//     PrivilegeModel.findById(req.user.accessPrivilege)
//         .then(function (userAccess) {
//             if (userAccess.value < util.ACCESS_TA)
//                 return res.status(403).send(noPrivilegeError(util.ACCESS_TA_DESCRIPTION)).end('Forbidden');
//             else
//                 return next();
//         })
//         .catch(function (error) {
//             return res.status(500).send(error.message).end();
//         });
// };

// module.exports.haveMinimumInstructorAccessPrivilege = function (req, res, next) {
//     "use strict";
//
//     PrivilegeModel.findById(req.user.accessPrivilege)
//         .then(function (userAccess) {
//             if (userAccess.value < util.ACCESS_INSTRUCTOR)
//                 return res.status(403).send(noPrivilegeError(util.ACCESS_INSTRUCTOR_DESCRIPTION)).end('Forbidden');
//             else
//                 return next();
//         })
//         .catch(function (error) {
//             return res.status(500).send(error.message).end();
//         });
// };

// module.exports.haveMinimumAdminAccessPrivilege = function (req, res, next) {
//     "use strict";
//
//     PrivilegeModel.findById(req.user.accessPrivilege)
//         .then(function (userAccess) {
//             if (userAccess.value !== util.ACCESS_ADMIN)
//                 return res.status(403).send(noPrivilegeError(util.ACCESS_ADMIN_DESCRIPTION)).end('Forbidden');
//             else
//                 return next();
//         })
//         .catch(function (error) {
//             return res.status(500).send(error.message).end();
//         });
// };

// module.exports.haveAuthority = function (req, res, next) {
//     "use strict";
//
//     if (req.user._id.equals(req.params.userID))
//         return res.status(400).send('You cannot perform this action for yourself.').end('Bad Request');
//
//     UserModel.findById(req.params.userID)
//         .then(function (targetUser) {
//             if (req.user.accessPrivilege.equals(targetUser.accessPrivilege)) // both users have the same access privilege
//                 return res.status(403).send(noAuthorityError()).end('Forbidden');
//             else
//                 return deepPrivilegeCheck(req.user.accessPrivilege, targetUser.accessPrivilege);
//         })
//         .catch(function (error) {
//             return res.status(500).send(error.message).end();
//         });
//
//     function deepPrivilegeCheck(reqUserPrivilegeID, targetPrivilegeID) {
//         PrivilegeModel.findByIds(reqUserPrivilegeID, targetPrivilegeID)
//             .then(function (array) {
//                 // access privilege array must contain 2 objects
//                 var reqUserAccessValue = null;
//                 var targetAccessValue = null;
//                 // compare the access privilege id to identify the value
//                 if (array[0]._id.equals(reqUserPrivilegeID)) {
//                     reqUserAccessValue = array[0].value;
//                     targetAccessValue = array[1].value;
//                 } else {
//                     reqUserAccessValue = array[1].value;
//                     targetAccessValue = array[0].value;
//                 }
//                 return (reqUserAccessValue <= targetAccessValue) ? res.status(403).send(noAuthorityError()).end('Forbidden') : next();
//             })
//             .catch(function (error) {
//                 return res.status(500).send(error.message).end();
//             });
//     }
// };

function noPrivilegeError(accessDescription) {
    var errmsg = 'Permission denied. You must have ';
    if (accessDescription !== util.ACCESS_ADMIN) errmsg += 'at least ';
    return errmsg + accessDescription.toUpperCase() + ' access privilege to perform this action.';
}

function noAuthorityError() {
    return 'Permission denied. Insufficient access privilege to perform this action. Target user has equal or higher access privilege.';
}
