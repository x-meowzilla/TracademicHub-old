var AccessLevelModel = require('../db_models/AccessLevel');
var access = require('./access_level');

module.exports = function () {

    (function initializeLocalAdminAccess() {
        var admin = new AccessLevelModel({value: access.ACCESS_LEVEL_ADMIN, description: access.ACCESS_LEVEL_ADMIN_DESCRIPTION});
        admin.save()
            .then(function (access) {
                console.log('Access created. Type: ' + access.description + ', Access Level: ' + access.value);
            });
    }());

    (function initializeLocalInstructorAccess() {
        var instructor = new AccessLevelModel({value: access.ACCESS_LEVEL_INSTRUCTOR, description: access.ACCESS_LEVEL_INSTRUCTOR_DESCRIPTION});
        instructor.save()
            .then(function (access) {
                console.log('Access created. Type: ' + access.description + ', Access Level: ' + access.value);
            });
    }());

    (function initializeLocalTAAccess() {
        var ta = new AccessLevelModel({value: access.ACCESS_LEVEL_TA, description: access.ACCESS_LEVEL_TA_DESCRIPTION});
        ta.save()
            .then(function (access) {
                console.log('Access created. Type: ' + access.description + ', Access Level: ' + access.value);
            });
    }());

    (function initializeLocalStudentAccess() {
        var student = new AccessLevelModel({value: access.ACCESS_LEVEL_STUDENT, description: access.ACCESS_LEVEL_STUDENT_DESCRIPTION});
        student.save()
            .then(function (access) {
                console.log('Access created. Type: ' + access.description + ', Access Level: ' + access.value);
            });
    }());

};
