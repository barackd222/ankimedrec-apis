// Create and start server on configured port
var config = require('./config');
var server = require('./server');

if(config.MONGODB_SERVER === undefined){
    config.MONGODB_SERVER = "localhost";
}

server.listen(config.port, function() {
    console.log('Swagger API server running on port ' + config.port);

    // Temp:
    console.log("MongoDB Server is [" + config.MONGODB_SERVER +
     "], MongoDB Port is [" + config.MONGODB_PORT + "]");
});