(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('leaderBoardRankController', leaderBoardRankController);

    leaderBoardRankController.$inject = ['$scope', '$location', '_AjaxRequest']; // dependency injection

    function leaderBoardRankController($scope, $location, _AjaxRequest) {

        (function () {
            _AjaxRequest.get('/api/points/history')
                .then(
                    // change to get leader board rank endpoint, get userID
                    function successCallback(result) {
                        $scope.pointsHistoryData = result.data;
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

        $scope.sort = {
            sortingOrder : '',
            reverse : false
        };
        $scope.viewby = '10';
        $scope.currentpage = 1;
        $scope.operations = [10, 20, 30];
        $scope.searchrecord = '';
        
        $scope.viewUserProfile = function (user) {

        };
    }

}());