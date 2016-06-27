var mongoose = require('mongoose');

module.exports = {
    notificationsSchema: mongoose.Schema({
        title: String,
        text: String,
        img: String,
        orientation: String,
        type: String
    }),
    usersSchema: mongoose.Schema({
        name: String,
        password: String
    })
};