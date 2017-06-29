var router = require('express').Router();
var mw = require('../modules/middlewares');
var PointModel = require('../db_models/Point');
var UserModel = require('../db_models/User');


// point URI: .../api/points/
router.get('/', mw.checkAuthentication, function (req, res) {
    "use strict";
    var findDoc = {};
    for (var arg in req.query) {
        switch (arg) {
            case '_id':
            case 'assignerID':
            case 'assigneeID':
            case 'grantDate':
            case 'value':
            case 'categoryID':
                findDoc[arg] = req.query[arg];
                break;
        }
    }

    PointModel.findPointData(findDoc)
        .then(function (pointsArray) {
            return res.json(pointsArray).end();
        })
        .catch(function (error) {
            return res.status(500).end(error.errmsg);
        });
});

router.post('/', mw.checkAuthentication, mw.haveMinimumTAAccessPrivilege, function (req, res) {
    "use strict";
    // req.body = {assigneeID, pointCategoryID, [pointValue]},
    UserModel.findById(req.body.assigneeID)
        .then(function (assignee) {
            return assignee ? grantPoint(req.user._id, assignee._id, req.body.pointValue, req.body.pointCategoryID) : res.status(404).send('Target assignee id: "' + req.params.assigneeID + '" does not exist.').end('Not Found');
        })
        .catch(function (error) {
            return res.status(500).end(error + ' 1');
        });

    function grantPoint(assignerID, assigneeID, pointValue, pointCategoryID) {
        var pointModel = new PointModel({assignerID: assignerID, assigneeID: assigneeID, value: pointValue ? pointValue : 1, categoryID: pointCategoryID});
        pointModel.save()
            .then(function (point) {
                return res.json(point).end();
            })
            .catch(function (error) {
                return res.status(500).end(error + ' 2');
            });
    }
});

router.delete('/', mw.checkAuthentication, mw.haveMinimumInstructorAccessPrivilege, function (req, res) {
    "use strict";
    var deleteDoc = {};
    for (var arg in req.query) {
        switch (arg) {
            case '_id':
            case 'assignerID':
            case 'assigneeID':
            case 'grantDate':
            case 'value':
            case 'categoryID':
                deleteDoc[arg] = req.query[arg];
                break;
        }
    }

    if (Object.keys(deleteDoc).length === 0) { // strictly check here. Valid query string must present!
        return res.status(400).send('Failed to delete. Delete option not found.').end('Bad Request');
    } else {
        PointModel.deletePointData(deleteDoc)
            .then(function (result) {
                return result.result.n;
            })
            .then(function (numRecords) {
                return numRecords ? 'Delete succeeded. ' + result.result.n + ' records deleted.' : 'Attention: No record has been deleted.';
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
