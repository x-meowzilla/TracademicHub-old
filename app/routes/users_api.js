var router = require('express').Router();
var Promise = require('bluebird');
var multer = require('multer');
var uploadMemory = multer({storage: multer.memoryStorage(), limits: {files: 1, fileSize: 32 * 1024 * 1024}}); // csv file 32MB file size limit
var uploadLocal = multer({dest: 'app/user_uploads/', limits: {files: 1, fileSize: 512 * 1024}}); // avatar image 512kB file size limit
var mw = require('../modules/middlewares');
var util = require('../modules/utility');
var UserModel = require('../db_models/User');
var CourseModel = require('../db_models/Course');

// users URI: .../api/users/
router.get('/', function (req, res) {
    "use strict";
    var findDoc = {};
    Object.keys(req.query).forEach(function (arg) {
        switch (arg) {
            case '_id':
            case 'utorid':
            case 'email':
            case 'studentNumber':
            case 'isActive':
                findDoc[arg] = req.query[arg];
                break;
            case 'courseEnrolled':
                findDoc[arg + '.course'] = req.query[arg];
                break;
            case 'firstName':
            case 'lastName':
            case 'preferredName':
                findDoc['name.' + arg] = req.query[arg];
                break;
        }
    });
    UserModel.findUserData(findDoc)
        .then(function (userArray) {
            var resultArray = userArray.map(function (user) {
                return util.retrieveBasicUserData(user);
            });
            return res.json(resultArray).end();
        })
        .catch(function (error) {
            return res.status(500).send(error).end();
        });
});

router.post('/', uploadMemory.single('csvfile'), function (req, res) {
    "use strict";
    // read csv file content from buffer and split file header and content, then generate file header and its corresponding indices
    var csv = parseCSVFile(req.file.buffer.toString());
    csv.header = parseCSVHeaders(csv.header);
    // if the header is invalid, return status 400 and error message
    if (!isValidCSVHeaders(csv.header))
        return res.status(400).send('Student CSV file is not properly formatted.').end();
    // // if the header is valid, then generate user data object
    var userDataArray = parseUserData(csv.header, csv.content);

    CourseModel.findCourseData({_id: req.body.course})
        .then(function (courseArray) {
            return {course: courseArray[0]._id, privilege: _privilegeFilter(courseArray[0].userPrivileges, 'Student')};

            function _privilegeFilter(privilegeArray, searchValue) {
                return privilegeArray.filter(function (privilegeObj) {
                    return privilegeObj['name'] === searchValue;
                })[0]._id; // filter the student privilege object and return the object id only
            }
        })
        .then(function (courseData) {
            var result = [];
            userDataArray.forEach(function (userData) {
                result.push(UserModel.updateOne({utorid: userData.utorid, studentNumber: userData.studentNumber}, // search by utorid and student number keys
                    {$set: userData, $addToSet: {courseEnrolled: courseData}}, // add the course to courseEnrolled property
                    {upsert: true}) // create new entry if student not found
                    .then(function (user) {
                        return true;
                    })
                    .catch(function (error) {
                        return false;
                    })
                );
            });
            return Promise.all(result); // this solution returns an array of boolean indicating success/failed to save records to database
        })
        .then(function (resultArray) {
            var num = resultArray.reduce(function (sum, boolResult) {
                return sum + boolResult;
            }, 0);
            var response = 'Imported from student CSV file. Total ' + resultArray.length + ' records found: ' + num + ' students enrolled successfully.';
            return res.send(response).end();
        })
        .catch(function (error) {
            return res.status(500).send(error.message).end();
        });

    function parseCSVFile(csvString) {
        var contentArray = csvString.split('\n').map(function (line) {
            return line.trim('\r').split(',');
        });
        var headerArray = contentArray.shift().map(function (header) {
            return header.toLowerCase();
        });
        return {header: headerArray, content: contentArray};
    }

    function parseCSVHeaders(headerArray) {
        return headerArray.map(function (header) {
            return header.includes(' ') ? _keyBuilder(header) : header;
        });

        function _keyBuilder(key) {
            var keyArray = key.split(' ');
            var first = keyArray[0];
            var rest = keyArray.splice(1).map(function (str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }).join('');
            return first.concat(rest);
        }
    }

    function isValidCSVHeaders(header) {
        // 5 required keys for uploading csv file
        return header.includes('utorid') && header.includes('email') && header.includes('studentNumber') && header.includes('firstName') && header.includes('lastName');
    }

    function parseUserData(header, contentArray) {
        return contentArray.map(function (content) {
            return _dataBuilder(header, content);
        });

        function _dataBuilder(keys, values) {
            var d = keys.reduce(function (prev, val, i) {
                prev[val] = values[i];
                return prev;
            }, {});
            d.isLocalUser = false;
            // merge name fields into one property
            d.name = {firstName: d.firstName, lastName: d.lastName};
            delete d.firstName;
            delete d.lastName;
            return d;
        }
    }

});

router.post('/:userID/avatar', uploadLocal.single('avatar'), function (req, res) {
    // TODO
});

router.patch('/:userID/update/user-info', mw.checkAuthentication, function (req, res) {
    "use strict";
    var updateDoc = {};
    Object.keys(req.query).forEach(function (arg) {
        switch (arg) {
            case 'preferredName':
                updateDoc['name.' + arg] = req.query[arg];
                break;
            case 'biography':
                updateDoc[arg] = req.query[arg];
                break;
        }
    });
    UserModel.updateUserData(req.params.userID, updateDoc)
        .then(function (user) {
            return res.json(util.retrieveBasicUserData(user)).end();
        })
        .catch(function (error) {
            return res.status(500).send(error).end();
        });
});

router.patch('/:userID/update/user-access', mw.checkAuthentication, function (req, res) {
    "use strict";
    var updateDoc = {};
    Object.keys(req.query).forEach(function (arg) {
        switch (arg) {
            case 'firstName':
            case 'lastName':
                updateDoc['name.' + arg] = req.query[arg];
                break;
            case 'email':
            case 'isActive':
                updateDoc[arg] = req.query[arg];
                break;
        }
    });
    UserModel.updateUserData(req.params.userID, updateDoc)
        .then(function (user) {
            return res.json(util.retrieveBasicUserData(user)).end();
        })
        .catch(function (error) {
            return res.status(500).send(error).end();
        });
});

module.exports = router;
