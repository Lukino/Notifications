var database = require('./database.js'),
    production = require('./production.js'),
    development = require('./development.js'),
    path = require('path');

module.exports = {
    database: database,
    server: process.env.TYPE == 'production' ? production : development,

    root: path.normalize(__dirname + '/../'),
    notificationsTypes: ['it', 'auto', 'winter']
};