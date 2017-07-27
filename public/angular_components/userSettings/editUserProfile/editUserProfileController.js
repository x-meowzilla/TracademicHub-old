(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('editUserProfileController', editUserProfileController)
        .directive('imageUpload', imageUpload);

    editUserProfileController.$inject = ['$scope', '_AjaxRequest', '_Authentication', '_ViewProfile']; // dependency injection

    function editUserProfileController($scope, _AjaxRequest, _Authentication, _ViewProfile) {

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
        $scope.editUserInfoOrigin = {
            editFirstName: $scope.currentUser.name.firstName,
            editLastName: $scope.currentUser.name.lastName,
            editPreferredName: $scope.currentUser.name.preferredName,
            editEmail: $scope.currentUser.email,
            editPrivilege: $scope.currentUser.accessPrivilege,
            editBiography: $scope.currentUser.biography,
            inputimage: "../images/default-avatar.png"
        };

        $scope.editUserInfo = angular.copy($scope.editUserInfoOrigin);

        // save changes
        $scope.updateUserProfile = function () {
            var updateBasicInfo = {};
            if($scope.editUserProfileForm.firstName.$dirty)
            {
                updateBasicInfo["firstName"] = $scope.editUserInfo.editFirstName;
            }
            if($scope.editUserProfileForm.lastName.$dirty)
            {
                updateBasicInfo["lastName"] = $scope.editUserInfo.editFirstName;
            }
            if($scope.editUserProfileForm.preferredName.$dirty)
            {
                updateBasicInfo["preferredName"] = $scope.editUserInfo.editPreferredName;
            }
            if($scope.editUserProfileForm.biography.$dirty)
            {
                updateBasicInfo["biography"] = $scope.editUserInfo.editBiography;
            }

            var updateMoreInfo = {};
            if($scope.editUserProfileForm.email.$dirty)
            {
                updateMoreInfo["email"] = $scope.editUserInfo.editEmail;
            }
            if($scope.editUserProfileForm.privilege.$dirty)
            {
                updateMoreInfo["privilege"] = $scope.editUserInfo.editPrivilege;
            }

            if($scope.editUserProfileForm.$dirty)
            {
                console.log(updateBasicInfo);
                _AjaxRequest.patch('/api/users/' + $scope.currentUser._id + '/update/user-access?' + $.param(updateBasicInfo), updateMoreInfo)
                    .then(
                        function successCallback(result) {
                            _Authentication.setCurrentUser(result.data);
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
        }

    }
    
    function imageUpload() {
        return {
            link: function(scope, element) {
                element.bind("change", function(changeEvent) {
                    var imageFile = changeEvent.target.files[0];
                    var reader = new FileReader();
                    reader.onload = function(loadEvent) {
                        scope.$apply(function() {
                            scope.editUserInfo.inputimage = loadEvent.target.result;
                            scope.editUserProfileForm.$pristine = false;
                        });
                    }
                    reader.readAsDataURL(imageFile);
                });
            }
        }
    }

}());