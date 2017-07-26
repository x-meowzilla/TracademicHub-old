(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('userProfileController', userProfileController);

    userProfileController.$inject = ['$scope', '$location', '_AjaxRequest', '_Authentication', '_ViewProfile', '_AssignPoints']; // dependency injection

    function userProfileController($scope, $location, _AjaxRequest, _Authentication, _ViewProfile, _AssignPoints) {

        $scope.currentUser = _ViewProfile.getUser();
        $scope.displayName = _Authentication.getDisplayName();

        $scope.loginUser = _Authentication.getCurrentUser();

        $scope.avatarUrl = "../images/default-avatar.png";
        // get user customized avatarUrl
        (function () {
            _AjaxRequest.get('/api/privileges/')
                .then(
                    function successCallback(result) {
                        // $scope.avatarUrl = result.data;
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                )
        }());

        // give points to current user
        $scope.getPoints = function () {
            $location.path( "/pointManagement" );
            _AssignPoints.setAssignees([$scope.currentUser]);
        };
    }

}());
