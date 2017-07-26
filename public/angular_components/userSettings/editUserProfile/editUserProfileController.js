(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('editUserProfileController', editUserProfileController)
        .directive('imageUpload', imageUpload);

    editUserProfileController.$inject = ['$scope', '_AjaxRequest', '_ViewProfile']; // dependency injection

    function editUserProfileController($scope, _AjaxRequest, _ViewProfile) {

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
        $scope.inputimage = "../images/default-avatar.png";

        // delete !!!
        $scope.userId = $scope.currentUser._id;

    }
    
    function imageUpload() {
        return {
            scope: {
                inputimage: "="
            },
            link: function(scope, element) {
                element.bind("change", function(changeEvent) {
                    var imageFile = changeEvent.target.files[0];
                    var reader = new FileReader();
                    reader.onload = function(loadEvent) {
                        scope.$apply(function() {
                            scope.inputimage = loadEvent.target.result;
                        });
                    }
                    reader.readAsDataURL(imageFile);
                });
            }
        }
    }

}());