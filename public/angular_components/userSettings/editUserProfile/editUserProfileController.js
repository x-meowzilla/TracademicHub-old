(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('editUserProfileController', editUserProfileController);

    editUserProfileController.$inject = ['$scope', '_AjaxRequest', '_Authentication', '_ViewProfile']; // dependency injection

    function editUserProfileController($scope, _AjaxRequest, _Authentication, _ViewProfile) {

        $scope.currentUser = _ViewProfile.getUser();

        // edit profile form
        $scope.privileges = [];
        (function () {
            _AjaxRequest.get('/api/privileges/')
                .then(
                    function successCallback(result) {
                        $scope.privileges = result.data;
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                )
        }());

        // fill in edit profile form
        $scope.editUserInfoOrigin = {
            editFirstName: $scope.currentUser.name.firstName,
            editLastName: $scope.currentUser.name.lastName,
            editPreferredName: $scope.currentUser.name.preferredName,
            editEmail: $scope.currentUser.email,
            editPrivilege: $scope.currentUser.accessPrivilege.description,
            editBiography: $scope.currentUser.biography,
            inputimage: "../images/default-avatar.png"
        };

        $scope.editUserInfo = angular.copy($scope.editUserInfoOrigin);

        // update user information
        $scope.updateUserProfile = function () {
            var updateBasicInfo = {};
            if($scope.editUserProfileForm.preferredName.$dirty)
            {
                updateBasicInfo["preferredName"] = $scope.editUserInfo.editPreferredName;
                $scope.currentUser["name"]["preferredName"] = $scope.editUserInfo.editPreferredName;
            }
            if($scope.editUserProfileForm.biography.$dirty)
            {
                updateBasicInfo["biography"] = $scope.editUserInfo.editBiography;
                $scope.currentUser["biography"] = $scope.editUserInfo.editBiography;
            }
            if(!angular.equals({}, updateBasicInfo))
            {
                _AjaxRequest.patch('/api/users/' + $scope.currentUser._id + '/update/user-info?' + $.param(updateBasicInfo))
                    .then(
                        function successCallback(result) {
                            _Authentication.setCurrentUser($scope.currentUser);
                            $scope.editUserProfileForm.$setPristine();
                            // TODO: show save successfully banner
                        },
                        function errorCallback(error) {
                            console.error(error);
                        }
                    );
            }

            var updateMoreInfo = {};
            if($scope.editUserProfileForm.firstName.$dirty)
            {
                updateMoreInfo["firstName"] = $scope.editUserInfo.editFirstName;
                $scope.currentUser["name"]["firstName"] = $scope.editUserInfo.editFirstName;
            }
            if($scope.editUserProfileForm.lastName.$dirty)
            {
                updateMoreInfo["lastName"] = $scope.editUserInfo.editLastName;
                $scope.currentUser["name"]["lastName"] = $scope.editUserInfo.editLastName;
            }
            if($scope.editUserProfileForm.email.$dirty)
            {
                updateMoreInfo["email"] = $scope.editUserInfo.editEmail;
                $scope.currentUser["email"] = $scope.editUserInfo.editEmail;
            }
            if($scope.editUserProfileForm.privilege.$dirty)
            {
                updateMoreInfo["privilege"] = $scope.editUserInfo.editPrivilege;
                $scope.currentUser["privilege"] = $scope.editUserInfo.editPrivilege;
            }
            if(!angular.equals({}, updateMoreInfo))
            {
                _AjaxRequest.patch('/api/users/' + $scope.currentUser._id + '/update/user-access?' + $.param(updateMoreInfo))
                    .then(
                        function successCallback(result) {
                            _Authentication.setCurrentUser($scope.currentUser);
                            $scope.editUserProfileForm.$setPristine();
                            // TODO: show save successfully banner
                        },
                        function errorCallback(error) {
                            console.error(error);
                        }
                    );
            }
        };

        $scope.clearForm = function () {
            angular.element("input[type='file']").val(null);
            $scope.editUserInfo = angular.copy($scope.editUserInfoOrigin);
            $scope.editUserProfileForm.$setPristine();
        };

        $scope.imageUpload = function (changeEvent) {
            var imageFile = changeEvent.target.files[0];
            var reader = new FileReader();
            reader.onload = function(loadEvent) {
                $scope.$apply(function() {
                    $scope.editUserInfo.inputimage = loadEvent.target.result;
                });
            }
            reader.readAsDataURL(imageFile);
        };

    }

}());