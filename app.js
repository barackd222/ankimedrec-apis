// Create and start server on configured port
var config = require('./config');
var server = require('./server');

server.listen(config.port, function() {
    console.log('Swagger API server running on port ' + config.port);

    // Temp:
    console.log("MongoDB Server is [" + process.env.MONGODB_SERVER +
     "], MongoDB Port is [" + process.env.MONGODB_PORT + "]");
});