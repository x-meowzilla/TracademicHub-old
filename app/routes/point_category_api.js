var router = require('express').Router();
var mw = require('../modules/middlewares');
var PointCategoryModel = require('../db_models/PointCategory');

// point category URI: .../api/points-category/
router.get('/', mw.checkAuthentication, function (req, res) {
    "use strict";
    PointCategoryModel.getPointCategoryData()
        .then(function (categoryArray) {
            return res.json(categoryArray).end();
        })
        .catch(function (error) {
            return res.status(500).end(error.errmsg);
        });
});

router.put('/', mw.checkAuthentication, mw.haveMinimumInstructorAccessPrivilege, function (req, res) {
    "use strict";
    PointCategoryModel.findByPointCategoryName(req.body.categoryName)
        .then(function (category) {
            return category ? res.status(409).send('Create point category failed. \'' + category.name + '\' category exists.').end('Conflict') : createPointCategory();
        })
        .catch(function (error) {
            res.status(500).end(error.errmsg);
        });

    function createPointCategory() {
        var category = new PointCategoryModel({name: req.body.categoryName});
        category.save()
            .then(function (category) {
                res.json(category).end();
            })
            .catch(function (error) {
                res.status(500).end(error.errmsg);
            });
    }
});

router.delete('/', mw.checkAuthentication, mw.haveMinimumInstructorAccessPrivilege, function (req, res) {
    "use strict";
    var deleteDoc = {};
    for (var arg in req.query) {
        switch (arg) {
            case '_id':
            case 'categoryName':
                deleteDoc[arg] = req.query[arg];
                break;
        }
    }

    if (Object.keys(deleteDoc).length === 0) { // strictly check here. Valid query string must present!
        return res.status(400).send('Failed to delete. Delete option not found.').end('Bad Request');
    } else {
        PointCategoryModel.deleteCategoryData(deleteDoc)
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
