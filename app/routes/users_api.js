var router = require('express').Router();
var mongoDB = require('mongodb').MongoClient;
var dbConfig = require('../configurations/db_config');
var dbModel = require('../db_models/User');

// users API
router.get('/', function (req, res) {
    console.log(req.session);
    res.send('GET request accepted.');
});

router.get('/:id', function (req, res) {
    res.send('GET request accepted, ID: ' + req.params.id);
});

router.get('/:id/history', function (req, res) {
    res.send('GET history');
});

router.post('/', function (req, res) {
    res.send('POST request accepted.');
});

router.delete('/', function (req, res) {
    res.send('DELETE!! delete all entries');
});

router.delete('/:id', function (req, res) {
    res.send('DELETE!! delete one entry');
});


// copied from existing code, need to update them
var checkAuthentication = function (req, res, next) {
    var user = req.session.user;
    if (user) {
        //req.user = user;
        res.cookie('username', user.username, {secure: true, sameSite: true, httpOnly: true});
        next();
    } else {
        res.clearCookie('username');
        // res.status(401).end("Unauthorized");
        res.json(null).end();
    }
};

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

var user = dbModel.User();
user.save(function (err, res) {
    if (err) return err;
    else return res;
});

// mongoAction('users', 'drop', {options: {}}, function (err, user) {
//     console.log("drop users table");
// });


module.exports = router;
