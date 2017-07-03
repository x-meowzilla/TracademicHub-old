(function () {
    'use strict';

    angular
        .module('TracademicHub', ['ngRoute', 'ngAnimate'])
        .config(function ($routeProvider, $locationProvider) {
            $locationProvider.hashPrefix('');
            $locationProvider.html5Mode(true);

            $routeProvider
                .when('/', {
                    templateUrl: 'angular_components/homepage/homepage.html'
                })
                .when('/profile', {
                    templateUrl: 'angular_components/userProfile/userProfile.html'
                })
                .when('/leaderBoardRank', {
                    templateUrl: 'angular_components/userProfile/leaderBoardRank.html'
                })
                .when('/states', {
                    templateUrl: 'angular_components/userProfile/states.html'
                })
                .when('/manageProducts', {
                    templateUrl: 'angular_components/userProfile/manageProducts.html'
                })
                .when('/pointsHistory', {
                    templateUrl: 'angular_components/userProfile/pointsHistory.html'
                })
                .when('/userManagement', {
                    templateUrl: 'angular_components/userProfile/userManagement.html'
                })
                .when('/pointManagement', {
                    templateUrl: 'angular_components/userProfile/pointManagement.html'
                })
                .when('/privilegeManagement', {
                    templateUrl: 'angular_components/userProfile/privilegeManagement.html'
                })
                .otherwise({
                    templateUrl: 'angular_components/error_pages/404.html'
                });
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
        });

}());
