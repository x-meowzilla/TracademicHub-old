(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('userProfileController', userProfileController);

    userProfileController.$inject = ['$scope', '_AjaxRequest', '_Authentication']; // dependency injection

    function userProfileController($scope, _AjaxRequest, _Authentication) {

        $scope.currentUser = _Authentication.getLoginUser();

        $scope.getDisplayName = function () {
            var userData = $scope.currentUser;
            if (userData.name.preferredName) {
                return userData.name.preferredName;
            } else if (userData.name.firstName && userData.name.lastName) {
                return userData.name.firstName + ' ' + userData.name.lastName;
            } else {
                return  userData.utorid;
            }
        };

        $scope.avatarUrl = $scope.currentUser.avatarPath? $scope.currentUser.avatarPath: "../images/default-avatar.png";


        // Morris data
        // Bar Chart
        Morris.Bar({
            element: 'statesBar',
            data: [{
                category: 'Experience Points',
                points: 24
            }, {
                category: 'Teaching Points',
                points: 43
            }, {
                category: 'Challenge Points',
                points: 25
            }, {
                category: 'Total Points',
                points: 30
            }, {
                category: 'LeaderBoard Rank',
                points: 5
            }],
            xkey: 'category',
            ykeys: ['points'],
            labels: ['Points'],
            barSizeRatio:0.35,
            hideHover: 'auto',
            xLabelAngle: 10,
            resize: true
        });

        // Donut Chart
        Morris.Donut({
            element: 'statesDonut',
            data: [{
                label: "Experience Points",
                value: 24
            }, {
                label: "Teaching Points",
                value: 43
            }, {
                label: "Challenge Points",
                value: 25
            }, {
                label: "Total Points",
                value: 30
            }, {
                label: "LeaderBoard Ranks",
                value: 5
            }],
            resize: true
        });

    }

}());
