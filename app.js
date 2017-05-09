var express = require('express');
// var expressValidator = require('express-validator');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var http = require('http');
// var passport = require('passport');


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


// app.get('/', function (req, res) {
//     res.redirect('/index.html');
// });


app.use(express.static('public'));

app.set('port', 3000);
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express is running.");
    console.log('HTTP on port ' + app.get('port'));
});

app.use(function (req, res, next) {
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

app.use(function (req, res) {
    console.log("HTTP Response", res.statusCode);
});
