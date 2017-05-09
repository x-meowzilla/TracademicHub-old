var app = angular.module('TracademicHub', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $routeProvider
        .when('/', {
            templateUrl: 'templates/homepage.html',
            controller: 'homepageController'
        })
        .when('/dashboard', {
            templateUrl: 'templates/dashboard.html',
            controller: 'dashboardController'
        })
        .when('/profile', {
            templateUrl: 'templates/profile.html'

        })



        .when('/admin', {
            templateUrl: 'templates/admin-main.html'
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
