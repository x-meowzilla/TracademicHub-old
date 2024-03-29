(function () {
    'use strict';

    angular
        .module('TracademicHub', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'angular-page-loader'])
        .config(function ($routeProvider, $locationProvider, $httpProvider, PRIVILEGE) {
            $httpProvider.defaults.withCredentials = true;

            $locationProvider.hashPrefix('');
            $locationProvider.html5Mode(true);

            $routeProvider
                .when('/', {
                    templateUrl: 'angular_components/homepage/homepage.html',
                    authenticate: false,
                    privilegeValue: PRIVILEGE.ACCESS_STUDENT_VALUE
                })
                .when('/profile', {
                    templateUrl: 'angular_components/userSettings/userProfile/userProfile.html',
                    authenticate: true,
                    privilegeValue: PRIVILEGE.ACCESS_STUDENT_VALUE
                })
                .when('/leaderBoardRank', {
                    templateUrl: 'angular_components/userSettings/leaderBoardRank/leaderBoardRank.html',
                    authenticate: true,
                    privilegeValue: PRIVILEGE.ACCESS_STUDENT_VALUE
                })
                .when('/states', {
                    templateUrl: 'angular_components/userSettings/states/states.html',
                    authenticate: true,
                    privilegeValue: PRIVILEGE.ACCESS_STUDENT_VALUE
                })
                .when('/manageProducts', {
                    templateUrl: 'angular_components/userSettings/manageProducts/manageProducts.html',
                    authenticate: true,
                    privilegeValue: PRIVILEGE.ACCESS_INSTRUCTOR_VALUE
                })
                .when('/pointsHistory', {
                    templateUrl: 'angular_components/userSettings/pointsHistory/pointsHistory.html',
                    authenticate: true,
                    privilegeValue: PRIVILEGE.ACCESS_INSTRUCTOR_VALUE
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
                    authenticate: true,
                    privilegeValue: PRIVILEGE.ACCESS_TA_VALUE
                })
                .when('/courseManagement', {
                    templateUrl: 'angular_components/userSettings/courseManagement/courseManagement.html',
                    authenticate: true,
                    privilegeValue: PRIVILEGE.ACCESS_ADMIN_VALUE
                })
                .when('/pointManagement', {
                    templateUrl: 'angular_components/userSettings/pointManagement/pointManagement.html',
                    authenticate: true,
                    privilegeValue: PRIVILEGE.ACCESS_TA_VALUE
                })
                // .when('/privilegeManagement', {
                //     templateUrl: 'angular_components/userSettings/privilegeManagement/privilegeManagement.html',
                //     authenticate: true
                // })
                .otherwise({
                    templateUrl: 'angular_components/error_pages/404.html',
                    authenticate: false,
                    privilegeValue: 0
                });

            $httpProvider.interceptors.push([
                '$injector',
                function ($injector) {
                    return $injector.get('_AuthInterceptor');
                }
            ]);
        })
        .run(function($rootScope, $location, _Authentication, AUTH_EVENTS){
            $rootScope.$on('$routeChangeStart', function (event, next) {
                if (next.$$route.authenticate && !_Authentication.isAuthenticated()) {
                    event.preventDefault();
                    $location.path('/');
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }
                else if(next.$$route.authenticate && _Authentication.isAuthenticated())
                {
                    if(!_Authentication.isAuthorized(next.$$route.privilegeValue))
                    {
                        event.preventDefault();
                        $location.path('/');
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                    }
                }
            });

            var path = function() { return $location.path();};
            $rootScope.$watch(path, function(newVal, oldVal){
                $rootScope.activetab = newVal;
            });

        });

}());
