var router = require('express').Router();
var Promise = require('bluebird');
var multer = require('multer');
var uploadMemory = multer({storage: multer.memoryStorage(), limits: {files: 1, fileSize: 32 * 1024 * 1024}}); // csv file 32MB file size limit
var uploadLocal = multer({dest: 'app/user_uploads/', limits: {files: 1, fileSize: 500 * 1024}}); // avatar image 500kB file size limit
var mw = require('../modules/middlewares');
var util = require('../modules/utility');
var UserModel = require('../db_models/User');
var PrivilegeModel = require('../db_models/AccessPrivilege');

// users URI: .../api/users/
router.get('/', mw.checkAuthentication, mw.haveMinimumTAAccessPrivilege, function (req, res) {
    "use strict";
    var findDoc = {};
    Object.keys(req.query).forEach(function (arg) {
        switch (arg) {
            case '_id':
            case 'utorid':
            case 'email':
            case 'studentNumber':
            case 'accessPrivilege':
            case 'isActive':
                findDoc[arg] = req.query[arg];
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

router.post('/', mw.checkAuthentication, mw.haveMinimumInstructorAccessPrivilege, uploadMemory.single('csvfile'), function (req, res) {
    "use strict";
    // read csv file content from buffer and split file header and content, then generate file header and its corresponding indices
    var csv = processFileData(req.file.buffer.toString());
    var header = generateFileHeader(csv.header);
    // if the header is invalid, return status 400 and error message
    if (!isFileHeaderProperlyFormatted(header))
        return res.status(400).send('Student CSV file is not properly formatted.').end();
    // if the header is valid, then generate user data object
    var userDataArray = generateUserData(header, csv.content);
    PrivilegeModel.findAccessPrivilegeData({value: util.ACCESS_STUDENT, description: util.ACCESS_STUDENT_DESCRIPTION})
        .then(function (accessArray) { // map student access to each user data object
            return userDataArray.map(function (userData) {
                userData.accessPrivilege = accessArray[0]._id;
                return userData;
            });
        })
        .then(function (userDataArray) { // save user, if duplicate exists, ignore it.
            var result = [];
            userDataArray.forEach(function (userData) {
                result.push(new UserModel(userData).save()
                    .then(function (user) {
                        return true;
                    })
                    .catch(function (error) {
                        return false;
                    })
                );
            });
            return Promise.all(result); // this solution returns an array of boolean indicating save new or get existing records to database
        })
        .then(function (resultArray) {
            var total = resultArray.length;
            var newRecord = resultArray.reduce(function (sum, boolResult) {
                return sum + boolResult;
            }, 0);
            var oldRecord = total - newRecord;
            var response = 'Imported from student CSV file. Total ' + total + ' records found: ';
            response += newRecord ? newRecord + ' new student records saved successfully. ' : '';
            response += oldRecord ? oldRecord + ' existing student records remain unchanged.' : '';
            return res.send(response).end();
        })
        .catch(function (error) {
            return res.status(500).send(error.message).end();
        });

    function processFileData(csvString) {
        var contentArray = csvString.split('\n').map(function (line) {
            return line.trim('\r').split(',');
        });
        var headerArray = contentArray.shift().map(function (header) {
            return header.toLowerCase();
        });
        return {header: headerArray, content: contentArray};
    }

    function generateFileHeader(headerArray) {
        // find the indices for each field, build user data object and push to array
        var utoridIdx = headerArray.indexOf('UTORiD'.toLowerCase());
        var emailIdx = headerArray.indexOf('Email'.toLowerCase());
        var studentNumberIdx = Math.max(headerArray.indexOf('Student Number'.toLowerCase()), headerArray.indexOf('StudentNumber'.toLowerCase()));
        var firstNameIdx = Math.max(headerArray.indexOf('First Name'.toLowerCase()), headerArray.indexOf('FirstName'.toLowerCase()));
        var lastNameIdx = Math.max(headerArray.indexOf('Last Name'.toLowerCase()), headerArray.indexOf('LastName'.toLowerCase()));
        return {utorid: utoridIdx, email: emailIdx, studentNumber: studentNumberIdx, firstName: firstNameIdx, lastName: lastNameIdx};
    }

    function isFileHeaderProperlyFormatted(header) {
        return Object.keys(header).reduce(function (result, key) {
            return result && (header[key] !== -1);
        }, true);
    }

    function generateUserData(header, contentArray) {
        return contentArray.map(function (content) {
            return {
                utorid: content[header.utorid],
                email: content[header.email],
                studentNumber: content[header.studentNumber],
                name: {firstName: content[header.firstName], lastName: content[header.lastName]}
            };
        });
    }

});

router.post('/:userID/avatar', uploadLocal.single('avatar'), function (req, res) {

});

router.patch('/:userID/update/user-info', mw.checkAuthentication, function (req, res) {
    "use strict";
    var updateDoc = {};
    Object.keys(req.query).forEach(function (arg) {
        switch (arg) {
            case 'firstName':
            case 'lastName':
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

router.patch('/:userID/update/user-access', mw.checkAuthentication, mw.haveMinimumInstructorAccessPrivilege, mw.haveAuthority, function (req, res) {
    "use strict";
    var updateDoc = {};
    Object.keys(req.query).forEach(function (arg) {
        switch (arg) {
            case 'firstName':
            case 'lastName':
                updateDoc['name.' + arg] = req.query[arg];
                break;
            case 'email':
            case 'studentNumber':
            case 'accessPrivilege':
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

// router.patch('/deactivate/', mw.checkAuthentication, mw.haveMinimumInstructorAccessPrivilege, function (req, res) {
//     UserModel.deactivateUsers()
//         .then(function (user) {
//             return res.json(util.retrieveBasicUserData(user)).end();
//         })
//         .catch(function (error) {
//             return res.status(500).end(error.errmsg);
//         });
// });


module.exports = router;
