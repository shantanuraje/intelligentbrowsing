// Setup for development and production environments
//if development, application runs on localhost, can be accessed on LAN
//if production, application runs on specified AWS instance
var config = {
    "development": {
        port: 3000,
        db: 'mongodb://127.0.0.1:27017/bookmarks-analyzer',
        host: '0.0.0.0'
    }
};

//export this configuration
module.exports = config;