(function () {
    'use strict';

    angular
        .module('TracademicHub', ['ngRoute'])
        .config(function ($routeProvider, $locationProvider) {
            $locationProvider.hashPrefix('');

            $routeProvider
                .when('/', {
                    templateUrl: 'angular_components/homepage/homepage.html',
                    controller: 'homepageController'
                })
                // .when('/dashboard', {
                //     templateUrl: 'templates/dashboard.html',
                //     controller: 'dashboardController'
                // })
                // .when('/profile', {
                //     templateUrl: 'templates/profile.html'
                //
                // })
                // .when('/admin', {
                //     templateUrl: 'templates/admin-main.html'
                // })
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

}());
