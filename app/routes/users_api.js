var router = require('express').Router();
var mongoDB = require('mongodb').MongoClient;
var dbConfig = require('../configurations/db_config');
var dbModel = require('../db_models/User');


var checkAuthentication = function (req, res, next) {
    var user = req.session.user;

    if (user) {
        if (!res.cookie.user) res.cookie('user', user, {secure: true, sameSite: true, httpOnly: true});
        else next();
    } else {
        res.clearCookie('user');
        res.status(401).send('Please login.').end("Unauthorized");
    }
};

// users API
router.get('/', checkAuthentication, function (req, res) {
    console.log(req.session);
    res.send('GET request accepted.');
});

router.get('/:id', checkAuthentication, function (req, res) {
    res.send('GET request accepted, ID: ' + req.params.id);
});

router.get('/:id/history', checkAuthentication, function (req, res) {
    res.send('GET history');
});

router.post('/', checkAuthentication, function (req, res) {
    res.send('POST request accepted.');
});

router.post('/:id/adjustPrivileges', function (req, res) {
    var userID = req.params.id;
    dbModel.findByID(userID, function (error, user) {
        if (error) return res.status(500).end(error);

        if (!user) {
            return res.status(404).end('User not found.');
        } else {
            var accessLevel = Number(req.body.accessLevel);
            // TODO - adjust user priviledges, try to use promise to avoid callbacks
        }
    });
});

router.delete('/', checkAuthentication, function (req, res) {
    res.send('DELETE!! delete all entries');
});

router.delete('/:id', checkAuthentication, function (req, res) {
    res.send('DELETE!! delete one entry');
});


// copied from existing code, need to update them


var verifyPassword = function (user, password) {
    var hash = crypto.createHmac('sha512', user.salt);
    hash.update(password);
    var value = hash.digest('base64');
    return (user.saltedHash === value);
};

var mongoAction = function (tableName, action, data, callback) {
    mongoDB.connect(dbConfig.dbURL, function (err, db) {
        if (err) {
            return console.log(err);
        } else {
            console.log("Mongo database connected");
            var collection = db.collection(tableName);
            switch (action) {
                case 'insertOne':
                    collection.insertOne(data.doc, data.options, callback);
                    break;
                case 'find':
                    collection.find(data.query).toArray(callback);
                    break;
                case 'findOne':
                    collection.findOne(data.query, data.options, callback);
                    break;
                case 'updateOne':
                    collection.updateOne(data.query, data.doc, data.options, callback);
                    break;
                case 'deleteMany':
                    collection.deleteMany(data.query, data.options, callback);
                    break;
                case 'deleteOne':
                    collection.deleteOne(data.query, data.options, callback);
                    break;
                case 'drop':
                    collection.drop(data.options, callback);
                    break;
            }
        }
        db.close();
    })
};

// testing schema
// mongoDB.connect(dbConfig.dbURL, function (err, db) {
//     var collection = db.collection('users');
//     collection.insertOne({firstname: 'eric'}, function (err, result) {
//         if (err) console.log(err);
//         else console.log(result.ops);
//     });
//     db.close();
// });


// var user = new dbModel.User();
// var promise = user.save();
// promise.then(function (doc) {
//     console.log(doc);
// });


// mongoAction('users', 'drop', {options: {}}, function (err, user) {
//     console.log("drop users table");
// });


module.exports = router;
