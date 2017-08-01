var router = require('express').Router();
var CourseModel = require('../db_models/Course');
var PrivilegeModel = require('../db_models/AccessPrivilege');

router.get('/', function (req, res) {
    "use strict";
    var findDoc = {};
    Object.keys(req.query).forEach(function (arg) {
        switch (arg) {
            case '_id':
            case 'startDate':
            case 'endDate':
            case 'name':
            case 'academicTerm':
            case 'isActive':
                findDoc[arg] = req.query[arg];
                break;
        }
    });

    CourseModel.findCourseData(findDoc)
        .then(function (courseArray) {
            return res.json(courseArray).end();
        })
        .catch(function (error) {
            return res.status(500).send(error).end();
        });

});

router.put('/', function (req, res) {
    "use strict";
    // req.body = {startDate, endDate, name, description, academicTerm (Fall, Winter, Summer, etc), userPrivileges}
    req.body.startDate += 'T00:00:00.000';
    req.body.endDate += 'T23:59:59.999';
    CourseModel.findCourseData({startDate: req.body.startDate, endDate: req.body.endDate, name: req.body.name})
        .then(function (courseArray) {
            return courseArray.length !== 0 ? res.status(409).send(getCourseExistsError(req.body)).end() : createCourse(req.body);
        })
        .catch(function (error) {
            return res.status(500).send(error).end();
        });

    function createCourse(courseData) {
        new CourseModel(courseData).save()
            .then(function (course) {
                return createAccessPrivileges(course);
            })
            .catch(function (error) {
                return res.status(500).send(error).end();
            });
    }

    function createAccessPrivileges(course) {
        PrivilegeModel.createDefaultPrivileges(course._id)
            .then(function (privilegeArray) {
                var resultIDs = privilegeArray.map(function (privilege) {
                    return privilege._id;
                });
                return updateCoursePrivilegeList(course._id, resultIDs);
            })
            .catch(function (error) {
                return res.status(500).send(error).end();
            });
    }

    function updateCoursePrivilegeList(courseID, privilegeIDs) {
        CourseModel.updateCourseData(courseID, {userPrivileges: privilegeIDs})
            .then(function (course) {
                return res.json(course).end();
            })
            .catch(function (error) {
                return res.status(500).send(error).end();
            });
    }

});

router.patch('/:courseID/update', function (req, res) {
    "use strict";
    var updateDoc = {};
    Object.keys(req.query).forEach(function (arg) {
        switch (arg) {
            case 'startDate':
            case 'endDate':
            case 'name':
            case 'description':
            case 'academicTerm':
            case 'accessPrivileges':  // TODO?
            case 'isActive':
                updateDoc[arg] = req.query[arg];
                break;
        }
    });
    CourseModel.updateCourseData(req.params.courseID, updateDoc)
        .then(function (course) {
            return res.json(course).end();
        })
        .catch(function (error) {
            return res.status(500).send(error).end();
        });
});

function getCourseExistsError(courseData) {
    return 'Course \'' + courseData.name + ' ' + courseData.academicTerm + ' ' + new Date(courseData.startDate).getFullYear() + '\' already exists.';
}

module.exports = router;
