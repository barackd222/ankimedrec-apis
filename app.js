// Create and start server on configured port
var config = require('./config');
var server = require('./server');

if(config.API_GW === undefined || config.RUNNING_MODE === undefined || config.MONGODB_PORT === undefined){
    console.log('Invalid properties. Please verify config properties file and try again.');
    process.exit();
}

server.listen(config.PORT, function() {
    console.log('Swagger API server running on port ' + config.PORT);

    // Temp:
    console.log("Running Mode is [" + config.RUNNING_MODE + "], MongoDB Port is [" + config.MONGODB_PORT + "]");
});