var PrivilegeModel = require('./db_models/AccessPrivilege');
var PointsCategoryModel = require('./db_models/PointCategory');
var util = require('./modules/utility');

module.exports = function () {
    "use strict";

    // (function initAdminAccessPrivilege() {
    //     var admin = new PrivilegeModel({value: util.ACCESS_ADMIN, description: util.ACCESS_ADMIN_DESCRIPTION});
    //     admin.save()
    //         .then(function (access) {
    //             console.log('Access created. Type: ' + access.description + ', Access Level: ' + access.value);
    //         })
    //         .catch(function (error) {
    //             console.log('Admin access exists.');
    //         });
    // }());
    //
    // (function initInstructorAccessPrivilege() {
    //     var instructor = new PrivilegeModel({value: util.ACCESS_INSTRUCTOR, description: util.ACCESS_INSTRUCTOR_DESCRIPTION});
    //     instructor.save()
    //         .then(function (access) {
    //             console.log('Access created. Type: ' + access.description + ', Access Level: ' + access.value);
    //         })
    //         .catch(function (error) {
    //             console.log('Instructor access exists.');
    //         });
    // }());
    //
    // (function initTeachingAssistantAccessPrivilege() {
    //     var ta = new PrivilegeModel({value: util.ACCESS_TA, description: util.ACCESS_TA_DESCRIPTION});
    //     ta.save()
    //         .then(function (access) {
    //             console.log('Access created. Type: ' + access.description + ', Access Level: ' + access.value);
    //         })
    //         .catch(function (error) {
    //             console.log('Teaching Assistant access exists.');
    //         });
    // }());
    //
    // (function initStudentAccessPrivilege() {
    //     var student = new PrivilegeModel({value: util.ACCESS_STUDENT, description: util.ACCESS_STUDENT_DESCRIPTION});
    //     student.save()
    //         .then(function (access) {
    //             console.log('Access created. Type: ' + access.description + ', Access Level: ' + access.value);
    //         })
    //         .catch(function (error) {
    //             console.log('Student access exists.');
    //         });
    // }());

    // (function initializeLearningPointsCategory() {
    //     var learningPtsCategory = new PointsCategoryModel({description: 'Learning Point'});
    //     learningPtsCategory.save()
    //         .then(function (category) {
    //             console.log('Points category created. Name: ' + category.description);
    //         })
    //         .catch(function (error) {
    //             console.log('Learning points category exists.');
    //         });
    // }());
    //
    // (function initializeExperiencePointsCategory() {
    //     var expPtsCategory = new PointsCategoryModel({description: 'Experience Point'});
    //     expPtsCategory.save()
    //         .then(function (category) {
    //             console.log('Points category created. Name: ' + category.description);
    //         })
    //         .catch(function (error) {
    //             console.log('Experience points category exists.');
    //         });
    // }());
    //
    // (function initializeChallengePointsCategory() {
    //     var challengePtsCategory = new PointsCategoryModel({description: 'Challenge Point'});
    //     challengePtsCategory.save()
    //         .then(function (category) {
    //             console.log('Points category created. Name: ' + category.description);
    //         })
    //         .catch(function (error) {
    //             console.log('Challenge points category exists.');
    //         });
    // }());

};
