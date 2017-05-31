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
var samlAPI = require('./routes/saml_api');
var localAuthAPI = require('./routes/local_auth_api');
var usersAPI = require('./routes/users_api');


// ----- app start here -----
var app = express();

var sessionData = {
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: true, // delete? because other apps store in different repo. check doc: https://github.com/expressjs/session
        maxAge: serverConfig.session.timeout
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
app.use(favicon(path.join('public', 'favicon.ico')));
app.use(passport.initialize());
app.use(passport.session());
passportAuthModule(passport);

// api routers
app.use('/', express.static('public'));
app.use('/api/users', usersAPI);
app.use('/local/', localAuthAPI);  // sign-in via Local Auth
// app.use('/Shibboleth.sso', samlAPI);  // sign-in via Shibboleth Auth

// // function handler
// app.use(function (req, res, next) {
//     console.log("HTTP request", req.method, req.url, req.body);
//     next();
// });
//
// app.use(function (req, res) {
//     console.log("HTTP Response", res.statusCode);
// });
//
// app.use(function (req, res) {
//     res.status(404).send('IC 404, Room not found!');
// });

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


module.exports = app;


// some potential use dependencies
// mongojs
