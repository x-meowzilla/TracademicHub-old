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

// config files
var serverConfig = require('./configurations/server_config');
var dbConfig = require('./configurations/db_config');
var mw = require('./modules/middlewares');
var passportAuthModule = require('./modules/passport_authentication');
var modelInitialization = require('./model_init');

// API endpoint router files
var shibbolethAuthAPI = require('./routes/shibboleth_api');
var usersAPI = require('./routes/users_api');
var coursesAPI = require('./routes/course_api');
var privilegeAPI = require('./routes/privilege_api');
var pointsAPI = require('./routes/point_api');
var pointsCategoryAPI = require('./routes/point_category_api');
var generalAPI = require('./routes/general_api');

// ----- app start here -----
var app = express();

var sessionData = {
    cookie: {
        secure: true,
        httpOnly: true,
        expires: serverConfig.session.duration
    },
    store: new MongoStore({url: dbConfig.dbURL, ttl: 2 * 60 * 60}),
    resave: false,
    saveUninitialized: false,
    rolling: true,
    unset: 'destroy',
    name: serverConfig.session.key,
    secret: serverConfig.session.secret
};
app.use(cookieParser(serverConfig.session.secret));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session(sessionData));
passportAuthModule(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator());
app.use(favicon(path.join('public', 'favicon.ico')));

// mongodb connection
mongoose.Promise = Promise;
mongoose.connect(dbConfig.dbURL, {useMongoClient: true, keepAlive: 100});
mongoose.connection.on('open', function (error) {
    return error ? console.error(error) : console.log('Connected to mongodb.');
});
mongoose.connection.on('disconnected', function (error) {
    return error ? console.error(error) : console.log('Disconnected from mongodb.');
});
mongoose.connection.on('error', function (error) {
    return console.error(error);
});

// api routers - these routers should put after sanitation function
app.use('/', express.static('public'));

// check and sanitize request body function
app.use(mw.sanitizeReqBodyHandler);
app.use(mw.sanitizeURIParamsHandler);
app.use(mw.sanitizeQueryStringHandler);

// to be removed. debugging purpose
app.use(function (req, res, next) {
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

app.use('/api/', generalAPI);
app.use('/api/users', usersAPI);
app.use('/api/courses', coursesAPI);
app.use('/api/privileges', privilegeAPI);
app.use('/Shibboleth.sso', shibbolethAuthAPI);  // sign-in via Shibboleth Auth
app.use('/api/points', pointsAPI);
app.use('/api/points-category', pointsCategoryAPI);

// rewrite vitual urls to angular app to enable refreshing of internal pages, only works for GET
app.get('/*', function (req, res) {
    res.sendFile(path.resolve('public/index.html'));
});


module.exports = app;
