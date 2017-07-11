(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('editUserProfileController', editUserProfileController);

    editUserProfileController.$inject = ['$scope', '_ViewProfile']; // dependency injection

    function editUserProfileController($scope, _ViewProfile) {

        $scope.currentUser = _ViewProfile.getUser();

        // edit profile form
        $scope.privileges = [];
        (function () {
            _AjaxRequest.get('/api/privileges/')
                .then(
                    function successCallback(result) {
                        console.log(result.data);
                        $scope.privileges = result.data;
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                )
        }());

        // fill in edit profile form
        $scope.editFirstName = $scope.currentUser.name.firstName;
        $scope.editLastName = $scope.currentUser.name.lastName;
        $scope.editPreferredName = $scope.currentUser.name.preferredName;
        $scope.editEmail = $scope.currentUser.email;
        $scope.editPrivilege = $scope.currentUser.accessPrivilege;
        $scope.editBiography = $scope.currentUser.biography;

        // delete !!!
        $scope.userId = $scope.currentUser._id;
    }

}());