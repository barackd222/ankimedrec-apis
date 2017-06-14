// Create and start server on configured port
var config = require('./config');
var server = require('./server');

server.listen(config.port, function() {
    console.log('Swagger API server running on port ' + config.port);

    // Temp:
    console.log("ICS Server is [" + config.ICS_SERVER + 
     "], ICS USername is [" + config.ICS_USERNAME +
     "], MongoDB Server is [" + process.env.MONGODB_SERVER +
     "], MongoDB Port is [" + process.env.MONGODB_PORT + "]");
});