(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('userProfileController', userProfileController);

    userProfileController.$inject = ['$scope', '_Authentication', '_ViewProfile']; // dependency injection

    function userProfileController($scope, _Authentication, _ViewProfile) {

        $scope.currentUser = _ViewProfile.getUser();
        $scope.displayName = _Authentication.getDisplayName();

    }

}());
