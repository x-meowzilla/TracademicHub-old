var router = require('express').Router();
var multer = require('multer');
var uploadMemory = multer({storage: multer.memoryStorage(), limits: {files: 1, fileSize: 50 * 1024 * 1024}}); // csv file 50MB file size limit
var uploadLocal = multer({dest: 'app/user_uploads/', limits: {files: 1, fileSize: 500 * 1024}}); // avatar image 500 kB file size limit
var mw = require('../modules/middlewares');
var util = require('../modules/utility');
var UserModel = require('../db_models/User');
var PrivilegeModel = require('../db_models/AccessPrivilege');

// users URI: .../api/users/
router.get('/', mw.checkAuthentication, mw.haveMinimumTAAccessPrivilege, function (req, res) {
    "use strict";
    var findDoc = {};
    for (var arg in req.query) {
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
    }

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

    PrivilegeModel.findByPrivilegeValueAndDescription(util.ACCESS_STUDENT, util.ACCESS_STUDENT_DESCRIPTION)
        .then(function (stuAccess) {
            return processFileData(req.file.buffer.toString(), stuAccess._id);
        })
        .then(function (userDataArray) {
            return (userDataArray.length !== 0) ? addBulkUserData(userDataArray) : res.json(userDataArray).end();
        })
        .catch(function (error) {
            res.status(500).send(error.message).end();
        });

    function processFileData(csvString, stuAccess) {
        var contentArray = csvString.split('\n').map(function (line) {
            return line.trim('\r').split(',');
        });
        var headerArray = contentArray.shift().map(function (header) {
            return header.toLowerCase();
        });
        // find the indices for each field, build user data object and push to array
        var utoridIdx = headerArray.indexOf('UTORiD'.toLowerCase());
        var emailIdx = headerArray.indexOf('Email'.toLowerCase());
        var studentNumberIdx = headerArray.indexOf('Student Number'.toLowerCase());
        var firstNameIdx = headerArray.indexOf('First Name'.toLowerCase());
        var lastNameIdx = headerArray.indexOf('Last Name'.toLowerCase());
        var userDataArray = [];
        for (var i = 0; i < contentArray.length; i++) {
            userDataArray.push({
                utorid: contentArray[i][utoridIdx],
                email: contentArray[i][emailIdx],
                studentNumber: contentArray[i][studentNumberIdx],
                name: {firstName: contentArray[i][firstNameIdx], lastName: contentArray[i][lastNameIdx]},
                accessPrivilege: stuAccess
            });
        }
        return userDataArray;
    }

    function addBulkUserData(userDataArray) {
        for (var i = 0; i < userDataArray.length; i++) {
            new UserModel(userDataArray[i]).save()
                .catch(function (error) {
                    console.log(error.message);
                });
        }
        res.send('done').end();
    }
});





router.post('/:userID/avatar', function (req, res) {

});

router.patch('/:userID/update/user-info', mw.checkAuthentication, function (req, res) {
    "use strict";
    var updateDoc = {};
    for (var arg in req.query) {
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
    }

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
    for (var arg in req.query) {
        switch (arg) {
            case 'accessPrivilege':
            case 'isActive':
                updateDoc[arg] = req.query[arg];
                break;
        }
    }

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
