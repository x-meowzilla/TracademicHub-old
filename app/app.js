var express = require('express');
var expressValidator = require('express-validator');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var session = require('express-session');
// var passport = require('passport');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(favicon(path.join('public', 'favicon.ico')));

app.use(express.static('public'));

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
