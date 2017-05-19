var app = require('./app');
var config = require('./configurations/server_config');
var http = require('http');
var https = require('https');
var fs = require('fs');

process.title = 'TracademicHub';
var port = normalizePort(process.env.PORT || config.port);
app.set('port', port);

// http server
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express is running.");
}).on('error', onError).on('listening', onListening);

// // https server
// var serverConfig = {
//     key: fs.readFileSync(config.httpsKey),
//     cert: fs.readFileSync(config.httpsCert)
// };
// https.createServer(serverConfig, app).listen(app.get('port'), function () {
//     console.log("Express is running.");
// }).on('error', onError).on('listening', onListening);


function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        return val; // named pipe
    }

    if (port >= 0) {
        return port; // port number
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = (typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port);

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = this.address();
    var bind = (typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port);
    console.log('Listening on ' + bind);
}
