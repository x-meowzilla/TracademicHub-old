(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('navbarController', navbarController);

    navbarController.$inject = ['$scope', '_CheckAuthentication']; // dependency injection
    function navbarController($scope, _CheckAuthentication, _AjaxRequest) {

        $scope.UTORidLogin = function () {
            return _CheckAuthentication.UTORidLogin();
        };

        $scope.isAuthenticated = function () {
            return _CheckAuthentication.isAuthenticated();
        };

        $scope.getAccessLevel = function () {
            return _CheckAuthentication.getAccessLevel();
        };

    }

}());
