var express = require('express');
var expressValidator = require('express-validator');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
// var passport = require('./passport');
var server_config = require('./configurations/server_config');
var db_config = require('./configurations/db_config');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(favicon(path.join('public', 'favicon.ico')));

var session_data = {
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: true, // delete? because other apps store in different repo. check doc: https://github.com/expressjs/session
        maxAge: server_config.session.timeout
    },
    store: new MongoStore({url: db_config.dbURL}),
    resave: false,
    saveUninitialized: false,
    rolling: true,
    unset: 'destroy',
    name: server_config.session.key,
    secret: server_config.session.secret
};
app.use(session(session_data));

app.use('/', express.static('public'));

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
