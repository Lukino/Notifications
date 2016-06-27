'use strict';

angular.module('notificationsModule', [
    'ngRoute'
])
    .controller('notificationsController',
        ['$rootScope', '$scope', '$routeParams', '$http',
            function ($rootScope, $scope, $routeParams, $http) {
                $http.get(`/notificationsList/${$routeParams.type}`)
                    .then(function (result) {
                        $rootScope.notificationsList = result.data.notifications;
                        $rootScope.newsType = result.data.type;

                        io().on(`${$rootScope.newsType} type added`, function (data) {
                            $rootScope.$apply(function () {
                                $rootScope.notificationsList.push(data.data);
                            });
                        });
                    });
            }])
    .controller('adminController',
        ['$routeParams', '$http', '$rootScope',
            function ($routeParams, $http, $rootScope) {
                $rootScope.notification = {};

                $rootScope.clear = function () {
                    $rootScope.notification = {};
                };

                $rootScope.save = function (notification) {
                    $http.post('/notificationAdd/', {
                        title: notification.title,
                        text: notification.text,
                        img: notification.img,
                        orientation: 'orientation-side',
                        type: notification.type
                    })
                        .then(function (result) {
                            // todo: რედირექტი ახალზე, ან ძვველის რედაქტირება
                        });
                }
            }])
    .run(['$rootScope',
        function ($rootScope) {
            $rootScope.title = 'Notifications System';
            $rootScope.favicon = '/img/favicon.png';

            $rootScope.notificationsList = [];
        }])
    .directive('navbar', function () {
        return {
            templateUrl: '/notifications/navbar.html'
        };
    })
    .directive('jumbotron', function () {
        return {
            templateUrl: '/notifications/jumbotron.html'
        };
    })
    .directive('notification', function () {
        return {
            templateUrl: '/notifications/orientation-side.html'
        };
    })
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/notifications/:type?', {
                templateUrl: '/notifications/notifications.html',
                controller: 'notificationsController'
            }).when('/admin', {
                templateUrl: '/notifications/admin.html',
                controller: 'adminController'
            }).otherwise({
                redirectTo: '/'
            });
        }
    ]);
