var app = angular.module('TracademicHub');
app.controller('navBarController', navBarController);

// navigation bar controller
function navBarController($scope, _CheckAuthentication) {

    $scope.isAuthenticated = function () {
        return _CheckAuthentication.isAuthenticated();
    };

    $scope.getAccessLevel = function () {
        return _CheckAuthentication.getAccessLevel();
    };

}