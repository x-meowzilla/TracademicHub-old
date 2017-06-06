(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('homepageController', homepageController);

    function homepageController($scope, _CheckAuthentication) {

        $scope.isAuthenticated = function () {
            return _CheckAuthentication.isAuthenticated();
        };

        $scope.getAccessLevel = function () {
            return _CheckAuthentication.getAccessLevel();
        };

        $scope.UTORidLogin = function () {
            return _CheckAuthentication.UTORidLogin();
        };
    }

}());
