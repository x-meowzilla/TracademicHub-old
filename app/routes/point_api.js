var router = require('express').Router();
var PointModel = require('../db_models/Point');
var UserModel = require('../db_models/User');

// point URI: .../api/points/
router.get('/history', function (req, res) {
    PointModel.getAllHistory()
        .then(function (historyArray) {
            res.json(historyArray).end();
        })
        .catch(function (error) {
            res.status(500).end(error.errmsg);
        });
});

router.get('/history/assigner/:assignerID', function (req, res) {
    PointModel.getHistoryByAssignerID(req.params.assignerID)
        .then(function (historyArray) {
            res.json(historyArray).end()
        })
        .catch(function (error) {
            res.status(500).end(error.errmsg);
        });
});

router.get('/history/assignee/:assigneeID', function (req, res) {
    PointModel.getHistoryByAssigneeID(req.params.assigneeID)
        .then(function (historyArray) {
            res.json(historyArray).end()
        })
        .catch(function (error) {
            res.status(500).end(error.errmsg);
        });
});

router.post('/', function (req, res) {
    // req.body = {assigneeID, pointCategoryID, [pointValue]},
    // TODO - add a handler to check access level
    UserModel.findById(req.body.assigneeID)
        .then(function (assignee) {
            return assignee ? grantPoint(assignee) : res.status(404).end('Target assignee id: "' + req.params.assigneeID + '" does not exist.');
        })
        .catch(function (error) {
            res.status(500).end(error.errmsg);
        });

    function grantPoint(assignee) {
        var assigner = req.session.user;
        var pointModel = new PointModel();
        // assigner data
        pointModel.assigner.id = assigner._id;
        pointModel.assigner.name = assigner.name;
        // assignee data
        pointModel.assignee.id = assignee._id;
        pointModel.assignee.name = assignee.name;
        // point value and category
        pointModel.value = req.body.pointValue ? req.body.pointValue : 1;
        pointModel.category = req.body.pointCategoryID;

        // save
        pointModel.save()
            .then(function (point) {
                res.json(point).end();
            })
            .catch(function (error) {
                res.status(500).end(error.errmsg);
            });
    }
});

router.delete('/:pointID', function (req, res) {
    PointModel.findById(req.params.pointID)
        .then(function (point) {
            return point ? deletePoint(point) : res.status(404).end('Point id: "' + req.params.pointID + '" does not exist.');
        })
        .catch(function (error) {
            res.status(500).end(error.errmsg);
        });

    function deletePoint(point) {
        PointModel.deleteByID(point._id)
            .then(function () {
                return res.send('Point id: "' + point._id + '" deleted.').end();
            });
    }
});


module.exports = router;
