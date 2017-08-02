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
                    authenticate: false
                })
                .when('/profile', {
                    templateUrl: 'angular_components/userSettings/userProfile/userProfile.html',
                    authenticate: true
                })
                .when('/leaderBoardRank', {
                    templateUrl: 'angular_components/userSettings/leaderBoardRank/leaderBoardRank.html',
                    authenticate: true
                })
                .when('/states', {
                    templateUrl: 'angular_components/userSettings/states/states.html',
                    authenticate: true
                })
                .when('/manageProducts', {
                    templateUrl: 'angular_components/userSettings/manageProducts/manageProducts.html',
                    authenticate: true
                })
                .when('/pointsHistory', {
                    templateUrl: 'angular_components/userSettings/pointsHistory/pointsHistory.html',
                    authenticate: true
                })
                // .when('/loginHistory', {
                //     templateUrl: 'angular_components/userSettings/loginHistory/loginHistory.html',
                //     authenticate: true
                // })
                // .when('/userManagementHistory', {
                //     templateUrl: 'angular_components/userSettings/userManagementHistory/userManagementHistory.html',
                //     authenticate: true
                // })
                .when('/userManagement', {
                    templateUrl: 'angular_components/userSettings/userManagement/userManagement.html',
                    authenticate: true
                })
                .when('/courseManagement', {
                    templateUrl: 'angular_components/userSettings/courseManagement/courseManagement.html',
                    authenticate: true
                })
                .when('/pointManagement', {
                    templateUrl: 'angular_components/userSettings/pointManagement/pointManagement.html',
                    authenticate: true
                })
                // .when('/privilegeManagement', {
                //     templateUrl: 'angular_components/userSettings/privilegeManagement/privilegeManagement.html',
                //     authenticate: true
                // })
                .otherwise({
                    templateUrl: 'angular_components/error_pages/404.html',
                    authenticate: false
                });
        })
        .run(function($rootScope, $location, _Authentication){
            $rootScope.$on('$routeChangeStart', function (event, next) {
                if (next.$$route.authenticate && !_Authentication.isAuthenticated()) {
                    event.preventDefault();
                    $location.path('/');
                }
            });

            var path = function() { return $location.path();};
            $rootScope.$watch(path, function(newVal, oldVal){
                $rootScope.activetab = newVal;
            });

        });

}());
