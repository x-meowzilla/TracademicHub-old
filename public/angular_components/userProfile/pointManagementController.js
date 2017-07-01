(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('pointManagementController', pointManagementController);

    pointManagementController.$inject = ['$scope', '_CheckAuthentication', '_AjaxRequest']; // dependency injection

    function pointManagementController($scope, _CheckAuthentication) {
        $scope.isAuthenticated = function () {
            return _CheckAuthentication.isAuthenticated();
        };

        $scope.getAccessLevel = function () {
            return _CheckAuthentication.getAccessLevel();
        };

    }

}());
