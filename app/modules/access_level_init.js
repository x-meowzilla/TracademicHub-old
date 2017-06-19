var AccessLevelModel = require('../db_models/AccessLevel');
var PointsCategoryModel = require('../db_models/PointCategory');
var access = require('./access_level');

module.exports = function () {

    (function initializeLocalAdminAccess() {
        var admin = new AccessLevelModel({value: access.ACCESS_LEVEL_ADMIN, description: access.ACCESS_LEVEL_ADMIN_DESCRIPTION});
        admin.save()
            .then(function (access) {
                console.log('Access created. Type: ' + access.description + ', Access Level: ' + access.value);
            })
            .catch(function (error) {
                console.log('Admin access exists.');
            })
    }());

    (function initializeLocalInstructorAccess() {
        var instructor = new AccessLevelModel({value: access.ACCESS_LEVEL_INSTRUCTOR, description: access.ACCESS_LEVEL_INSTRUCTOR_DESCRIPTION});
        instructor.save()
            .then(function (access) {
                console.log('Access created. Type: ' + access.description + ', Access Level: ' + access.value);
            })
            .catch(function (error) {
                console.log('Instructor access exists.');
            })
    }());

    (function initializeLocalTAAccess() {
        var ta = new AccessLevelModel({value: access.ACCESS_LEVEL_TA, description: access.ACCESS_LEVEL_TA_DESCRIPTION});
        ta.save()
            .then(function (access) {
                console.log('Access created. Type: ' + access.description + ', Access Level: ' + access.value);
            })
            .catch(function (error) {
                console.log('TA access exists.');
            })
    }());

    (function initializeLocalStudentAccess() {
        var student = new AccessLevelModel({value: access.ACCESS_LEVEL_STUDENT, description: access.ACCESS_LEVEL_STUDENT_DESCRIPTION});
        student.save()
            .then(function (access) {
                console.log('Access created. Type: ' + access.description + ', Access Level: ' + access.value);
            })
            .catch(function (error) {
                console.log('Student access exists.');
            })
    }());

    (function initializeLearningPointsCategory() {
        var learningPtsCategory = new PointsCategoryModel({name: 'Learning Point'});
        learningPtsCategory.save()
            .then(function (category) {
                console.log('Points category created. Name: ' + category.name);
            })
            .catch(function (error) {
                console.log('Learning points category exists.');
            })
    }());

    (function initializeExperiencePointsCategory() {
        var expPtsCategory = new PointsCategoryModel({name: 'Experience Point'});
        expPtsCategory.save()
            .then(function (category) {
                console.log('Points category created. Name: ' + category.name);
            })
            .catch(function (error) {
                console.log('Experience points category exists.');
            })
    }());

    (function initializeChallengePointsCategory() {
        var challengePtsCategory = new PointsCategoryModel({name: 'Challenge Point'});
        challengePtsCategory.save()
            .then(function (category) {
                console.log('Points category created. Name: ' + category.name);
            })
            .catch(function (error) {
                console.log('Challenge points category exists.');
            })
    }());

};
