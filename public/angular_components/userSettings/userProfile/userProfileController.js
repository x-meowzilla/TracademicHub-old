(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('userProfileController', userProfileController);

    userProfileController.$inject = ['$scope', '$location', '_AjaxRequest', '_Authentication', '_AssignPoints']; // dependency injection

    function userProfileController($scope, $location, _AjaxRequest, _Authentication, _AssignPoints) {

        $scope.currentUser = _Authentication.getCurrentUser();

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

        $scope.loginUser = _Authentication.getCurrentUser();

        $scope.avatarUrl = "../images/default-avatar.png";
        // get user customized avatarUrl
        (function () {
            _AjaxRequest.get('/api/privileges/')
                .then(
                    function successCallback(result) {
                        // $scope.avatarUrl = result.data;
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                )
        }());

        // give points to current user
        $scope.getPoints = function () {
            $location.path( "/pointManagement" );
            _AssignPoints.setAssignees([$scope.currentUser]);
        };


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
