(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('leaderBoardRankController', leaderBoardRankController);

    function leaderBoardRankController($scope, _CheckAuthentication) {
        $scope.isAuthenticated = function () {
            return _CheckAuthentication.isAuthenticated();
        };

        $scope.getAccessLevel = function () {
            return _CheckAuthentication.getAccessLevel();
        };

    }

}());