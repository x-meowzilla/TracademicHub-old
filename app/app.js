var express = require('express');
var expressValidator = require('express-validator');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
// var passport = require('./passport');

// config files and API file path
var serverConfig = require('./configurations/server_config');
var dbConfig = require('./configurations/db_config');
var usersAPI = require('./routes/usersAPI');


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

// api routers
app.use('/', express.static('public'));
app.use('/api/users', usersAPI);

// function handler
app.use(function (req, res, next) {
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

app.use(function (req, res) {
    console.log("HTTP Response", res.statusCode);
});

module.exports = app;


// some potential use dependencies
// mongojs
