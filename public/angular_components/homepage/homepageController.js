(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('homepageController', homepageController);

    homepageController.$inject = ['$scope', '_UTORidAuthentication', '_CheckAuthentication'];
    function homepageController($scope, _UTORidAuthentication, _CheckAuthentication) {

        $scope.UTORidLogin = function () {
            return _UTORidAuthentication.UTORidLogin();
        };

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
