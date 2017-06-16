var router = require('express').Router();
var PointCategoryModel = require('../db_models/PointCategory');

// point category URI: .../api/points-category/
router.get('/', function (req, res) {
    PointCategoryModel.find({})
        .then(function (categoryArray) {
            res.json(categoryArray).end();
        })
        .catch(function (error) {
            res.status(500).end(error.errmsg);
        });
});

router.put('/', function (req, res) {
    PointCategoryModel.findOne({name: req.body.categoryName})
        .then(function (category) {
            if (category) {
                res.status(409).end('Category: \'' + category.name + '\' exists.');
            } else {
                category = new PointCategoryModel({name: req.body.categoryName});
                category.save()
                    .then(function (category) {
                        res.json(category).end();
                    })
                    .catch(function (error) {
                        res.status(500).end(error.errmsg);
                    });
            }
        })
        .catch(function (error) {
            res.status(500).end(error.errmsg);
        });
});

router.delete('/:categoryName', function (req, res) {
    PointCategoryModel.remove({name: req.params.categoryName})
        .then(function () {
            res.send('Category: \'' + req.params.categoryName + '\' deleted.').end();
        })
        .catch(function (error) {
            res.status(500).end(error.errmsg);
        })
});


module.exports = router;
