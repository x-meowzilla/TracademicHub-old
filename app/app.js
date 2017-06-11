var express = require('express');
var expressValidator = require('express-validator');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var Promise = require('bluebird');

// config files and API file path
var serverConfig = require('./configurations/server_config');
var dbConfig = require('./configurations/db_config');
var passportAuthModule = require('./modules/passport_authentication');
var shibbolethAuthAPI = require('./routes/shibboleth_auth_api');
var localAuthAPI = require('./routes/local_auth_api');
var usersAPI = require('./routes/users_api');


// ----- app start here -----
var app = express();

var sessionData = {
    cookie: {
        secure: true,
        httpOnly: true,
        expires: serverConfig.session.timeout
    },
    store: new MongoStore({url: dbConfig.dbURL}),
    resave: false,
    saveUninitialized: false,
    rolling: true,
    unset: 'destroy',
    name: serverConfig.session.key,
    secret: serverConfig.session.secret
};
app.use(session(sessionData));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressValidator());
app.use(favicon(path.join('public', 'favicon.ico')));
app.use(passport.initialize());
app.use(passport.session());
passportAuthModule(passport);

// mongodb connection
var mongooseOptions = {server: {socketOptions: {keepAlive: 100}}};
mongoose.Promise = Promise;
mongoose.connect(dbConfig.dbURL, mongooseOptions);
mongoose.connection.on('open', function (error) {
    return error ? console.error(error) : console.log('Connected to mongodb.');
});
mongoose.connection.on('disconnected', function (error) {
    return error ? console.error(error) : console.log('Disconnected from mongodb.')
});
mongoose.connection.on('error', function (error) {
    return console.error(error);
});

// check and sanitize request body function
app.use(function sanitizeReqBodyHandler(req, res, next) {
    Object.keys(req.body).forEach(function (arg) {
        req.sanitizeBody(arg).escape();
        switch (arg) {
            case 'utorid':
                req.checkBody(arg, 'UTORid must be alphanumeric characters').isAlphanumeric();
                break;
            case 'email':
                req.checkBody(arg, 'Invalid email address').isEmail();
                break;
            case 'password':
                req.checkBody(arg, 'Password should be alphanumeric characters').isAlphanumeric();
                req.checkBody(arg, 'Password must be at least 6 characters long').isByteLength(6);
                break;
            case 'firstName':
                req.checkBody(arg, 'First name must be letters').isAlpha();
                break;
            case 'lastName':
                req.checkBody(arg, 'Last name must be letters').isAlpha();
                break;
            case 'preferredName':
                break;
        }
    });

    req.getValidationResult()
        .then(function (result) {
            if (!result.isEmpty()) {
                var list = [];
                result.array().forEach(function (error) {
                    list.push(error.msg);
                });
                return res.status(400).json(list.join(" & ")).end();
            } else {
                next();
            }
        });
});

// api routers - these routers should put after sanitation function
app.use('/', express.static('public'));

// to be removed. debugging purpose
app.use(function (req, res, next) {
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

app.use('/api/users', usersAPI);
app.use('/api/local/users', localAuthAPI);  // sign-in via Local Auth
app.use('/Shibboleth.sso', shibbolethAuthAPI);  // sign-in via Shibboleth Auth


module.exports = app;
