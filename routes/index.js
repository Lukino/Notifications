"use strict";
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    dbSchemes = require('../config/schemes.js'),
    config = require('../config/config.js');

module.exports = function (app) {

    router.get('/', function (req, res, next) {
        res.render('public/notifications/index');
    });

    router.get('/notificationsList/:type?', function (req, res) {
        function getRandomType() {
            var index = parseInt(Math.random() * 100) % config.notificationsTypes.length;
            return config.notificationsTypes[index];
        }

        var type = (req.params.type || getRandomType()).toLowerCase();
        var notificationsModel = mongoose.model('notifications', dbSchemes.notificationsSchema);

        if (type === 'all') {
            notificationsModel.find(function (err, notifications) {
                res.json({notifications, type: 'all'});
            });
        }
        else {
            if (config.notificationsTypes.indexOf(type) == -1) {
                type = getRandomType();
            }
            notificationsModel.find({type: type}, function (err, notifications) {
                res.json({notifications, type});
            });
        }
    });

    router.post('/notificationAdd', function (req, res, next) {
        var notificationsModel = mongoose.model('notifications', dbSchemes.notificationsSchema);
        var newNotification = new notificationsModel({
            title: req.body.title,
            text: req.body.text,
            img: req.body.img,
            orientation: req.body.orientation,
            type: req.body.type
        });

        newNotification.save(function (err) {
            if (!err) {
                global.socket.emit(`${req.body.type} type added`, {
                    data: newNotification
                });
                global.socket.emit('all type added', {
                    data: newNotification
                });
            }
        });

        res.sendStatus(200);
    });

    return router;
};
