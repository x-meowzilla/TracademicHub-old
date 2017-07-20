var router = require('express').Router();
var mw = require('../modules/middlewares');
var PointCategoryModel = require('../db_models/PointCategory');

// point category URI: .../api/points-category/
router.get('/', mw.checkAuthentication, mw.haveMinimumTAAccessPrivilege, function (req, res) {
    "use strict";
    var findDoc = {};
    Object.keys(req.query).forEach(function (arg) {
        switch (arg) {
            case '_id':
            case 'description':
                findDoc[arg] = req.query[arg];
                break;
        }
    });
    PointCategoryModel.findPointCategoryData(findDoc)
        .then(function (categoryArray) {
            return res.json(categoryArray).end();
        })
        .catch(function (error) {
            return res.status(500).send(error).end();
        });
});

router.put('/', mw.checkAuthentication, mw.haveMinimumInstructorAccessPrivilege, function (req, res) {
    "use strict";
    PointCategoryModel.findPointCategoryData({description: req.body.description})
        .then(function (categoryArray) {
            return (categoryArray.length !== 0) ? res.status(409).send('Failed to create point category. \'' + categoryArray[0].description + '\' category exists.').end() : createPointCategory(req.body.description);
        })
        .catch(function (error) {
            res.status(500).send(error).end();
        });

    function createPointCategory(description) {
        new PointCategoryModel({description: description}).save()
            .then(function (category) {
                res.json(category).end();
            })
            .catch(function (error) {
                res.status(500).send(error).end();
            });
    }
});

router.delete('/', mw.checkAuthentication, mw.haveMinimumInstructorAccessPrivilege, function (req, res) {
    "use strict";
    var deleteDoc = {};
    Object.keys(req.query).forEach(function (arg) {
        switch (arg) {
            case '_id':
            case 'description':
                deleteDoc[arg] = req.query[arg];
                break;
        }
    });
    if (Object.keys(deleteDoc).length === 0) { // strictly check here. Valid query string must present!
        return res.status(400).send('Failed to delete. Delete option not found.').end();
    } else {
        PointCategoryModel.deleteCategoryData(deleteDoc)
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
