(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('statesController', statesController);

    function statesController($scope, _CheckAuthentication) {
        $scope.isAuthenticated = function () {
            return _CheckAuthentication.isAuthenticated();
        };

        $scope.getAccessLevel = function () {
            return _CheckAuthentication.getAccessLevel();
        };

    };
}());
