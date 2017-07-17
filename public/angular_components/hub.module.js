(function () {
    'use strict';

    angular
        .module('TracademicHub', ['ngRoute', 'ngAnimate', 'ui.bootstrap'])
        .config(function ($routeProvider, $locationProvider) {
            $locationProvider.hashPrefix('');
            $locationProvider.html5Mode(true);

            $routeProvider
                .when('/', {
                    templateUrl: 'angular_components/homepage/homepage.html',
                    authenticate: false
                })
                .when('/profile', {
                    templateUrl: 'angular_components/userProfile/userProfile.html',
                    authenticate: true
                })
                .when('/leaderBoardRank', {
                    templateUrl: 'angular_components/userProfile/leaderBoardRank.html',
                    authenticate: true
                })
                .when('/states', {
                    templateUrl: 'angular_components/userProfile/states.html',
                    authenticate: true
                })
                .when('/manageProducts', {
                    templateUrl: 'angular_components/userProfile/manageProducts.html',
                    authenticate: true
                })
                .when('/pointsHistory', {
                    templateUrl: 'angular_components/userProfile/pointsHistory.html',
                    authenticate: true
                })
                .when('/loginHistory', {
                    templateUrl: 'angular_components/userProfile/loginHistory.html',
                    authenticate: true
                })
                .when('/userManagementHistory', {
                    templateUrl: 'angular_components/userProfile/userManagementHistory.html',
                    authenticate: true
                })
                .when('/userManagement', {
                    templateUrl: 'angular_components/userProfile/userManagement.html',
                    authenticate: true
                })
                .when('/pointManagement', {
                    templateUrl: 'angular_components/userProfile/pointManagement.html',
                    authenticate: true
                })
                .when('/privilegeManagement', {
                    templateUrl: 'angular_components/userProfile/privilegeManagement.html',
                    authenticate: true
                })
                .otherwise({
                    templateUrl: 'angular_components/error_pages/404.html',
                    authenticate: false
                });
        })
        .run(function($rootScope, $location, _Authentication){

            $rootScope.$on('$routeChangeStart', function (event, next) {
                if (next.$$route.authenticate && !_Authentication.isAuthenticated()) {
                    console.log('DENY');
                    // event.preventDefault();
                    // $location.path('/');
                }
                else {
                    console.log('ALLOW');
                }
            });

        });

}());
