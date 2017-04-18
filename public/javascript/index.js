var app = angular.module('TracademicHub', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'templates/homepage.html',
            controller: 'homepageController'
        })
        .when('/dashboard', {
            templateUrl: 'templates/dashboard.html',
            controller: 'dashboardController'
        })
        // .when('/someRoute', {
        //     templateUrl: 'templates/someRoute.html',
        //     controller: 'someController'
        // })
        // .when('/someRoute/:id', {
        //     templateUrl: 'templates/someRoute.html',
        //     controller: 'someDetailedController'
        // })
        .otherwise('/');
});

app.factory('_CheckAuthentication', function () {
    return {
        isAuthenticated: function () {
            return true;
        },
        getAccessLevel: function () {
            if (!this.isAuthenticated()) {
                return -1;
            } else {
                return 50;
            }
        }
    };
});
