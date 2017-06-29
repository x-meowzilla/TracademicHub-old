(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('userManagementController', userManagementController);

    userManagementController.$inject = ['$scope', '_CheckAuthentication', '_AjaxRequest']; // dependency injection

    function userManagementController($scope, _CheckAuthentication, _AjaxRequest) {
        $scope.isAuthenticated = function () {
            return _CheckAuthentication.isAuthenticated();
        };

        $scope.getAccessLevel = function () {
            return _CheckAuthentication.getAccessLevel();
        };

        // grid view
        (function () {
            _AjaxRequest.get('/api/users/')
                .then(
                function successCallback(result) {
                    $scope.userDatas = result.data;
                },
                function errorCallback(error) {
                    console.error(error);
                }
            )
        }());

        (function () {
            _AjaxRequest.get('/api/users/')
                .then(
                    function successCallback(result) {
                        $scope.items = result.data;
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                )
        }());

        $scope.sort = {
            sortingOrder : '',
            reverse : false
        };
        $scope.viewby = '10';
        $scope.currentpage = 1;
        $scope.operations = [10, 20, 30];
        $scope.searchrecord = '';
    }

}());
