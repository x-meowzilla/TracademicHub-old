(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('userProfileController', userProfileController)
        .directive('barChart', barChart)
        .directive('donutChart', donutChart);

    userProfileController.$inject = ['$scope', '_AjaxRequest', '_Authentication']; // dependency injection

    function userProfileController($scope, _AjaxRequest, _Authentication) {

        $scope.getCurrentUser = function () {
            return _Authentication.getLoginUser();
        };

        $scope.getDisplayName = function (){
            return _Authentication.getDisplayName();
        };

        $scope.avatarUrl = $scope.getCurrentUser().avatarPath? $scope.getCurrentUser().avatarPath: "../images/default-avatar.png";

        $scope.courses = [];
        (function () {
            _AjaxRequest.get('/api/courses/')
                .then(
                    function successCallback(result) {
                        $scope.courses = result.data;
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                )
        }());

        // Morris data
        // Bar Chart
        $scope.bardata = [];
        $scope.xkey = "category";
        $scope.ykeys = ['points'];
        $scope.labels = ['Points'];

        $scope.$watch('selectedCourseBar', function(newValue, oldValue) {
            if(newValue !== oldValue)
            {
                $scope.bardata = angular.isUndefined(newValue) ?
                    [] :
                    [{
                        category: 'Experience Points',
                        points: 3
                    }, {
                        category: 'Teaching Points',
                        points: 100
                    }, {
                        category: 'Challenge Points',
                        points: 20
                    }, {
                        category: 'Total Points',
                        points: 1
                    }, {
                        category: 'LeaderBoard Rank',
                        points: 70
                    }];
            }
        }, true);


        // Donut Chart
        $scope.donutdata = [];

        $scope.$watch('selectedCourseDonut', function(newValue, oldValue) {
            if(newValue !== oldValue)
            {
                $scope.bardata = angular.isUndefined(newValue) ?
                    [] :
                    [{
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
                    }];
            }
        }, true);

    }

    function barChart(){
        return {
            restrict: 'E',
            template: '<div></div>',
            scope: {
                bardata: '=',
                xkey: '=',
                ykeys: '=',
                labels: '='
            },
            replace: true,
            link:function($scope,element)
            {
                $scope.statesBar = {};

                var displayBar = function () {

                    if($scope.bardata.length !== 0)
                    {
                        if(angular.equals({}, $scope.statesBar))
                        {
                            $scope.statesBar = Morris.Bar({
                                element: element,
                                data: $scope.bardata,
                                xkey: $scope.xkey,
                                ykeys: $scope.ykeys,
                                labels: $scope.labels,
                                barSizeRatio:0.35,
                                hideHover: 'auto'
                            });
                        }
                        else
                        {
                            $scope.statesBar.setData($scope.bardata);
                        }
                    }
                };

                (function () {
                    displayBar();
                }());

                $scope.$watch('bardata', function(newValue, oldValue) {
                    displayBar();
                }, true);

            }
        }
    }

    function donutChart(){
        return {
            restrict: 'E',
            template: '<div></div>',
            scope: {
                donutdata: '='
            },
            replace: true,
            link:function($scope,element)
            {
                $scope.statesDonut = {};

                var displayDonut = function () {

                    if($scope.donutdata.length !== 0)
                    {
                        if(angular.equals({}, $scope.statesDonut))
                        {
                            $scope.statesDonut = Morris.Donut({
                                element: element,
                                data: $scope.donutdata,
                                resize: true
                            });
                        }
                        else
                        {
                            $scope.statesDonut.setData($scope.donutdata);
                        }
                    }
                };

                (function () {
                    displayDonut();
                }());

                $scope.$watch('donutdata', function(newValue, oldValue) {
                    displayDonut();
                }, true);

            }
        }
    }

}());
