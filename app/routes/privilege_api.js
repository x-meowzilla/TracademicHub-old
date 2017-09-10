var router = require('express').Router();
var Promise = require('bluebird');
var mw = require('../modules/middlewares');
var PrivilegeModel = require('../db_models/AccessPrivilege');

// access privilege URI: .../api/privileges/
router.get('/', mw.checkAuthentication, function (req, res) {
    "use strict";
    var findDoc = {};
    Object.keys(req.query).forEach(function (arg) {
        switch (arg) {
            case '_id':
            case 'name':
            case 'course':
            case 'value':
                findDoc[arg] = req.query[arg];
                break;
        }
    });

    PrivilegeModel.findAccessPrivilegeData(findDoc)
        .then(function (privilegeArray) {
            return res.json(privilegeArray).end();
        })
        .catch(function (error) {
            return res.status(500).send(error).end();
        });

});

// temporary routes to check if this user can view on specific page
router.get('/temp/authorized/:privilegeValue', mw.checkAuthentication, function (req, res) {
    if (req.user.courseEnrolled.length === 0)
        res.json(0 >= req.query.privilegeValue).end(); // no course enrolled
    else {
        var privilegeArray = parsePrivilegeArray(req.user.courseEnrolled); // parse the id
        var valueArray = parseValueArray(privilegeArray);

    }
    //TODO: async issue!
    res.json(valueArray);

    function parsePrivilegeArray(courseEnrolled) {
        return courseEnrolled.map(function (c) {
            return c.privilege;
        });
    }
    function parseValueArray(privilegeArray) {
        var valueArray = [];
        valueArray.push(privilegeArray.map(function (pid) {
            PrivilegeModel.findAccessPrivilegeData({_id: pid})
                .then(function (privilegeArray) {
                    return privilegeArray === 0 ? 0 : privilegeArray[0].value;
                })
                .catch(function (error) {
                    return 0;
                })
        }));
        return Promise.all(valueArray);
    }

});

// router.delete('/', mw.checkAuthentication, function (req, res) {
//     "use strict";
//     var deleteDoc = {};
//     Object.keys(req.query).forEach(function (arg) {
//         switch (arg) {
//             case '_id':
//             case 'value':
//             case 'description':
//                 deleteDoc[arg] = req.query[arg];
//                 break;
//         }
//     });
//     if (Object.keys(deleteDoc).length === 0) { // strictly check here. Valid query string must present!
//         return res.status(400).send('Failed to delete. Delete option not found.').end();
//     } else {
//         // PrivilegeModel.deleteAccessPrivilegeData(deleteDoc)
//         //     .then(function (result) {
//         //         return result.result.n;
//         //     })
//         //     .then(function (numRecords) {
//         //         return numRecords ? 'Delete succeeded. ' + numRecords + ' records deleted.' : 'No record has been deleted.';
//         //     })
//         //     .then(function (msg) {
//         //         return res.send(msg).end();
//         //     })
//         //     .catch(function (error) {
//         //         return res.status(500).send(error).end();
//         //     });
//     }
// });

module.exports = router;
