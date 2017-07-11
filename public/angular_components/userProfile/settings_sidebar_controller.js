(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('settingsSidebarController', settingsSidebarController);

    settingsSidebarController.$inject = ['$scope', '$route', '_AjaxRequest', '_ViewProfile']; // dependency injection

    function settingsSidebarController($scope, $route, _AjaxRequest, _ViewProfile) {

        $scope.viewUserProfile = function () {
            console.log('hi');
            $route.reload();
            // _ViewProfile.setUser(JSON.parse(window.localStorage.getItem('currentUser'))._id);
            _ViewProfile.setUser('59544e374609bf493b5c6023');
        };

    }

}());
