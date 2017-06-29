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

        $scope.items = [
            {"fullName":1,"preferredName":"name 1","category":"description 1","course":"field3 1","date":"field4 1"},
            {"fullName":2,"preferredName":"name 2","category":"description 1","course":"field3 5","date":"field4 2"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":5,"preferredName":"name 5","category":"description 1","course":"field3 7","date":"field4 5"},
            {"fullName":6,"preferredName":"name 6","category":"description 1","course":"field3 6","date":"field4 6"},
            {"fullName":9,"preferredName":"name 6","category":"description 1","course":"field3 6","date":"field4 6"}
        ];

        (function () {
            _AjaxRequest.get('/api/points/history')
                .then(
                    function successCallback(result) {
                        $scope.pointsHistoryData = result.data;
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
