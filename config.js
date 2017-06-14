// Define app configuration in a single location, but pull in values from
// system environment variables (so we don't check them in to source control!)
module.exports = {

    // ICS Details:
    ICS_SERVER: process.env.ICS_SERVER,
    ICS_USERNAME: process.env.ICS_USERNAME,
    ICS_PASSWORD: process.env.ICS_PASSWORD,

    // MongoDB Details:
    MONGODB_SERVER: process.env.MONGODB_SERVER || localhost,
    MONGODB_PORT: process.env.MONGODB_PORT || 27017,

    // The port your web application will run on
    port: process.env.PORT || 3006

};