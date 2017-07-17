(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('userProfileController', userProfileController);

    userProfileController.$inject = ['$scope', '$location', '_Authentication', '_ViewProfile', '_AssignPoints']; // dependency injection

    function userProfileController($scope, $location, _Authentication, _ViewProfile, _AssignPoints) {

        $scope.currentUser = _ViewProfile.getUser();
        $scope.displayName = _Authentication.getDisplayName();

        $scope.loginUser = _Authentication.getCurrentUser();

        // give points to current user
        $scope.getPoints = function () {
            $location.path( "/pointManagement" );
            _AssignPoints.setAssignees([$scope.currentUser]);
        };
    }

}());
