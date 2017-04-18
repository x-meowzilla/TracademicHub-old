var app = angular.module('TracademicHub');
app.controller('homepageController', homeController);

// home page controller functions
function homeController($scope, _CheckAuthentication) {

    $scope.isAuthenticated = function () {
        return _CheckAuthentication.isAuthenticated();
    };

    $scope.getAccessLevel = function () {
        return _CheckAuthentication.getAccessLevel();
    };

}