(function () {
    'use strict';

    angular
        .module('TracademicHub', ['ngRoute', 'ngAnimate'])
        .config(function ($routeProvider, $locationProvider) {
            $locationProvider.hashPrefix('');
            $locationProvider.html5Mode(true);

            $routeProvider
                .when('/', {
                    templateUrl: 'angular_components/homepage/homepage.html',
                    controller: 'homepageController'
                })
                .when('/settings', {
                    templateUrl: 'angular_components/userProfile/userProfile.html',
                    controller: 'userProfileController'
                })
                .when('/leaderBoardRank', {
                    templateUrl: 'angular_components/userProfile/leaderBoardRank.html',
                    controller: 'leaderBoardRankController'
                })
                .when('/states', {
                        templateUrl: 'angular_components/userProfile/states.html',
                        controller: 'statesController'
                })
                .when('/manageProducts', {
                    templateUrl: 'angular_components/userProfile/manageProducts.html',
                    controller: 'manageProductsController'
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
