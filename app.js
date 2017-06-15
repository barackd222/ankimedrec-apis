// Create and start server on configured port
var config = require('./config');
var server = require('./server');

if(config.API_GW === undefined || config.MONGODB_SERVER === undefined || config.MONGODB_PORT === undefined){
    console.log('Invalid properties. Please verify config properties file and try again.');
    process.exit();
}

server.listen(config.port, function() {
    console.log('Swagger API server running on port ' + config.port);

    // Temp:
    console.log("MongoDB Server is [" + config.MONGODB_SERVER +
     "], MongoDB Port is [" + config.MONGODB_PORT + "], API GW is [" + config.API_GW + "]");
});