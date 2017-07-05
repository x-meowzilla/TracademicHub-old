var router = require('express').Router();
var mw = require('../modules/middlewares');
var PrivilegeModel = require('../db_models/AccessPrivilege');

// point URI: .../api/privileges/
router.get('/', mw.checkAuthentication, mw.haveMinimumInstructorAccessPrivilege, function (req, res) {
    "use strict";
    var findDoc = {};
    Object.keys(req.query).forEach(function (arg) {
        switch (arg) {
            case '_id':
            case 'value':
            case 'description':
                findDoc[arg] = req.query[arg];
                break;
        }
    });
    PrivilegeModel.getAccessPrivilegeData(findDoc)
        .then(function (pointsArray) {
            return res.json(pointsArray).end();
        })
        .catch(function (error) {
            return res.status(500).send(error).end();
        });
});

router.delete('/', mw.checkAuthentication, mw.haveMinimumInstructorAccessPrivilege, function (req, res) {
    "use strict";
    var deleteDoc = {};
    Object.keys(req.query).forEach(function (arg) {
        switch (arg) {
            case '_id':
            case 'value':
            case 'description':
                deleteDoc[arg] = req.query[arg];
                break;
        }
    });
    if (Object.keys(deleteDoc).length === 0) { // strictly check here. Valid query string must present!
        return res.status(400).send('Failed to delete. Delete option not found.').end();
    } else {
        PrivilegeModel.deleteAccessPrivilegeData(deleteDoc)
            .then(function (result) {
                return result.result.n;
            })
            .then(function (numRecords) {
                return numRecords ? 'Delete succeeded. ' + numRecords + ' records deleted.' : 'No record has been deleted.';
            })
            .then(function (msg) {
                return res.send(msg).end();
            })
            .catch(function (error) {
                return res.status(500).send(error).end();
            });
    }
});


module.exports = router;
