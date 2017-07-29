(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('settingsSidebarController', settingsSidebarController);

    settingsSidebarController.$inject = ['$scope', '$route', '_Authentication', '_ViewProfile']; // dependency injection

    function settingsSidebarController($scope, $route, _Authentication, _ViewProfile) {
        $scope.viewUserProfile = function () {
            _ViewProfile.setUser(_Authentication.getCurrentUser());
            $route.reload();
        };

    }

}());
