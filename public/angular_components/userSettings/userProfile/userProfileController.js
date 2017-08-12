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
            angular.forEach($scope.getCurrentUser().courseEnrolled, function (item) {
                _AjaxRequest.get('/api/courses?' + $.param({_id: item.course}))
                    .then(
                        function successCallback(result) {
                            $scope.courses.push(result.data[0].name);
                        },
                        function errorCallback(error) {
                            console.error(error);
                        }
                    );
            });
        }());

        // Morris data
        var getDataList = function (chartType) {
            var data = [];

            _AjaxRequest.get('/api/points-category/')
                .then(
                    function successCallback(result) {
                        angular.forEach(result.data, function (category) {
                            var value = 0;
                            _AjaxRequest.get('/api/points?' + $.param({assignerID: $scope.getCurrentUser()._id, categoryID: category._id}))
                                .then(
                                    function successCallback(points) {
                                        angular.forEach(points.data, function (point) {
                                            value = value + point.value;
                                        });
                                    },
                                    function errorCallback(error) {
                                        console.error(error);
                                    }
                                );
                            if(value !== 0)
                            {
                                if(chartType === 'donut')
                                {
                                    data['label'] = category.name;
                                    data['value'] = value;
                                }
                                else if(chartType === 'bar')
                                {
                                    data['category'] = category.name;
                                    data['points'] = value;
                                }

                            }
                        });
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                );

            return data;
        };

        // Bar Chart
        $scope.bardata = [];
        $scope.xkey = "category";
        $scope.ykeys = ['points'];
        $scope.labels = ['Points'];

        $scope.$watch('selectedCourseBar', function(newValue, oldValue) {
            if(newValue !== oldValue)
            {
                $scope.bardata = angular.isUndefined(newValue) ?
                    [] : getDataList();
            }
        }, true);


        // Donut Chart
        $scope.donutdata = [];

        $scope.$watch('selectedCourseDonut', function(newValue, oldValue) {
            if(newValue !== oldValue)
            {
                $scope.donutdata = angular.isUndefined(newValue) ?
                    [] : getDataList();
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
