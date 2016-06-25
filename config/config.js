var database = require('./database.js'),
    production = require('./production.js'),
    development = require('./development.js');

module.exports = {
    database: database,
    server: process.env.TYPE == 'production' ? production : development
};