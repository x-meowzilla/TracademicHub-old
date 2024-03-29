var router = require('express').Router();
var mw = require('../modules/middlewares');
var util = require('../modules/utility');
var PointModel = require('../db_models/Point');
var UserModel = require('../db_models/User');


// point URI: .../api/points/
router.get('/', mw.checkAuthentication, function (req, res) {
    "use strict";
    var findDoc = {};
    Object.keys(req.query).forEach(function (arg) {
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
    });
    PointModel.findPointData(findDoc)
        .then(function (pointsArray) {
            var resultArray = pointsArray.map(function (point) {
                return util.retrieveBasicPointData(point);
            });
            return res.json(resultArray).end();
        })
        .catch(function (error) {
            return res.status(500).send(error).end();
        });
});

// get point records between a period
router.get('/period', mw.checkAuthentication, function (req, res) {
    "use strict";
    if(!req.query.userID || !req.query.startDate || !req.query.endDate)
    {
        return res.status(500).send(error).end();
    }
    PointModel.getPointsByPeriod(req.query)
        .then(function (pointsArray) {
            return res.json(pointsArray).end();
        })
        .catch(function (error) {
            return res.status(500).send(error).end();
        });
});

// get totl points that each user has
router.get('/sum', mw.checkAuthentication, function (req, res) {
    "use strict";
    PointModel.getPointsSum(req.query)
        .then(function (pointsArray) {
            return res.json(pointsArray).end();
        })
        .catch(function (error) {
            return res.status(500).send(error).end();
        });
});

router.post('/', mw.checkAuthentication, function (req, res) {
    "use strict";
    // req.body = {assigneeID, pointCategoryID, [pointValue]},  // TODO - courseID
    UserModel.findById(req.body.assigneeID)
        .then(function (assignee) {
            return assignee ? grantPoint(req.user._id, assignee._id, req.body.pointValue, req.body.pointCategoryID) : res.status(404).send('Target assignee id: "' + req.params.assigneeID + '" does not exist.').end();
        })
        .catch(function (error) {
            return res.status(500).send(error).end();
        });

    function grantPoint(assignerID, assigneeID, pointValue, pointCategoryID) {
        new PointModel({assigner: assignerID, assignee: assigneeID, value: pointValue ? pointValue : 1, category: pointCategoryID}).save()
            .then(function (point) {
                return res.json(point).end();
            })
            .catch(function (error) {
                return res.status(500).send(error).end();
            });
    }
});

router.delete('/', mw.checkAuthentication, function (req, res) {
    "use strict";
    var deleteDoc = {};
    Object.keys(req.query).forEach(function (arg) {
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
    });
    if (Object.keys(deleteDoc).length === 0) { // strictly check here. Valid query string must present!
        return res.status(400).send('Failed to delete. Delete option not found.').end();
    } else {
        PointModel.deletePointData(deleteDoc)
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
