(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('pointsHistoryController', pointsHistoryController);

    function pointsHistoryController($scope, _CheckAuthentication) {
        $scope.isAuthenticated = function () {
            return _CheckAuthentication.isAuthenticated();
        };

        $scope.getAccessLevel = function () {
            return _CheckAuthentication.getAccessLevel();
        };

    }

}());
