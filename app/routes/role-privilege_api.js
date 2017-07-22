var router = require('express').Router();
var PrivilegeModel = require('../db_models/AccessPrivilege');

// point URI: .../api/privileges/
router.get('/', function (req, res) {
    "use strict";
    var findDoc = {};
    Object.keys(req.query).forEach(function (arg) {
        switch (arg) {
            case '_id':
            case 'name':
            case 'description':
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

router.post('/', function (req, res) {
    "use strict";
    // req.body = {name, description, course?, responsibility?}

    new PrivilegeModel({name: req.body.name, description: req.body.description, course: req.body.courseID})
        .save()
        .then(function (privilege) {
            return res.json(privilege).end();
        })
        .catch(function (error) {
            return res.status(500).send(error).end();
        });


    PrivilegeModel.findAccessPrivilegeData({name: req.body.name})

});

module.exports = router;
