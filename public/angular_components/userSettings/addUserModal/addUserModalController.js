(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('addUserModalController', addUserModalController);

    addUserModalController.$inject = ['$scope', '$location', '_AjaxRequest']; // dependency injection

    function addUserModalController($scope, $location, _AjaxRequest) {
        $scope.editUserInfoOrigin = {utorid: '', password: '', repassword: '', firstName: '', lastName: '', preferredName: '', email: '', accessPrivilege: ''};
        $scope.editUserInfo = angular.copy($scope.editUserInfoOrigin);

        $scope.utoridExist = false;

        $scope.createAdmin = function () {
            console.log($scope.editUserInfo);
            var basicUserInfo = {utorid: $scope.editUserInfo.utorid};
            _AjaxRequest.put('/api/local-register/', $scope.editUserInfo)
                .then(
                    function successCallback(result) {
                        $scope.clearForm();
                        angular.element("#addUserModal").modal('hide');
                    },
                    function errorCallback(error) {
                        console.error(error);
                        if(error.status === 409)
                        {
                            $scope.utoridExist = true;
                        }
                    }
                );
        };

        $scope.importCSVFile = function () {
            _AjaxRequest.post('/api/users/', $scope.csvfile)
                .then(
                    function successCallback(result) {
                        $location.path( "/userManagement" );
                        $scope.clearForm();
                        // TODO: show save successfully banner
                    },
                    function errorCallback(error) {
                        // TODO: show save failed banner
                        console.error(error);
                    }
                );
        };

        $scope.clearForm = function () {
            angular.element("input[type='file']").val(null);
            $scope.editUserInfo = angular.copy($scope.editUserInfoOrigin);
            $scope.addUserForm.$setPristine();
        };
    }

}());