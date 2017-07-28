(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('addUserModalController', addUserModalController);

    addUserModalController.$inject = ['$scope', '_AjaxRequest']; // dependency injection

    function addUserModalController($scope, _AjaxRequest) {
        $scope.editUserInfoOrigin = {utorid: '', password: '', repassword: '', firstName: '', lastName: '', preferredName: '', email: '', accessPrivilege: ''};
        $scope.editUserInfo = angular.copy($scope.editUserInfoOrigin);

        $scope.createUser = function () {
            console.log($scope.editUserInfo);
            var basicUserInfo = {utorid: $scope.editUserInfo.utorid};
            _AjaxRequest.put('/api/local-register/', $scope.editUserInfo)
                .then(
                    function successCallback(result) {
                        // TODO: show save successfully banner
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                );
        };
        
        $scope.importCSVFile = function () {
            
        };

        $scope.clearForm = function () {
            angular.element("input[type='file']").val(null);
            $scope.editUserInfo = angular.copy($scope.editUserInfoOrigin);
            $scope.addUserForm.$setPristine();
        };
    }

}());