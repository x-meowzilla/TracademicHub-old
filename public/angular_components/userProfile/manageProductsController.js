(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('manageProductsController', manageProductsController);

    function manageProductsController($scope, _CheckAuthentication) {
        $scope.toggled = false;

        $scope.isAuthenticated = function () {
            return _CheckAuthentication.isAuthenticated();
        };

        $scope.getAccessLevel = function () {
            return _CheckAuthentication.getAccessLevel();
        };

    }

}());
