(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('statesController', statesController)
        .directive('areaChart', areaChart);

    statesController.$inject = ['$scope', '_Authentication', '_AjaxRequest']; // dependency injection

    function statesController($scope, _Authentication, _AjaxRequest) {
        $scope.currentUser = _Authentication.getLoginUser();
        $scope.displayName = _Authentication.getDisplayName();

        $scope.items = [
            {"fullName":1,"preferredName":"aame 1","category":"description 1","course":"field3 1","date":"field4 1"},
            {"fullName":2,"preferredName":"eame 2","category":"description 1","course":"field3 5","date":"field4 2"},
            {"fullName":3,"preferredName":"came 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"hame 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"dame 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"game 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"mame 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"bame 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"oame 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"pame 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"qame 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"evme 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"same 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"vame 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"seme 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":3,"preferredName":"name 3","category":"description 1","course":"field3 3","date":"field4 3"},
            {"fullName":5,"preferredName":"name 5","category":"description 1","course":"field3 7","date":"field4 5"},
            {"fullName":6,"preferredName":"name 6","category":"description 1","course":"field3 6","date":"field4 6"},
            {"fullName":9,"preferredName":"name 6","category":"description 1","course":"field3 6","date":"field4 6"}
        ];

        $scope.courses = [];

        (function () {
            // get point history
            _AjaxRequest.get('/api/points/history')
                .then(
                    function successCallback(result) {
                        $scope.pointsHistoryData = result.data;
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                );

            // get courses
            if($scope.currentUser.isLocalUser)
            {
                // local admin can get view all courses
                _AjaxRequest.get('/api/courses/')
                    .then(
                        function successCallback(result) {
                            $scope.courses = result.data;
                        },
                        function errorCallback(error) {
                            console.error(error);
                        }
                    )
            }
            else
            {
                // get the courses that current user has access to.
                var courseIds = [];
                angular.forEach($scope.currentUser.courseEnrolled, function (item) {
                    var courseId = item.course._id;
                    if(courseIds.indexOf(courseId) < 0)
                    {
                        _AjaxRequest.get('/api/courses?' + $.param({_id: courseId}))
                            .then(
                                function successCallback(result) {
                                    $scope.courses.push(result.data[0]);
                                    courseIds.push(result.data[0]._id);
                                },
                                function errorCallback(error) {
                                    console.error(error);
                                }
                            );
                    }
                });
            }
        }());



        $scope.sort = {
            sortingOrder : '',
            reverse : false
        };
        $scope.viewby = '5';
        $scope.currentpage = 1;
        $scope.operations = [5, 10, 20];
        $scope.searchrecord = '';



        // Area Chart
        $scope.areadata = [];
        $scope.xkey = "period";
        $scope.ykeys = ['teaching', 'experience', 'challenge'];
        $scope.labels = ['teaching points', 'experience points', 'challenge points'];

        $scope.$watch('selectedCourseArea', function(newValue, oldValue) {
            if(newValue !== oldValue)
            {
                $scope.areadata = angular.isUndefined(newValue) ?
                    [] :
                    [{
                        period: '2010 Q1',
                        teaching: 2666,
                        experience: null,
                        challenge: 2647
                    }, {
                        period: '2010 Q2',
                        teaching: 2778,
                        experience: 2294,
                        challenge: 2441
                    }, {
                        period: '2010 Q3',
                        teaching: 4912,
                        experience: 1969,
                        challenge: 2501
                    }, {
                        period: '2010 Q4',
                        teaching: 3767,
                        experience: 3597,
                        challenge: 5689
                    }, {
                        period: '2011 Q1',
                        teaching: 6810,
                        experience: 1914,
                        challenge: 2293
                    }, {
                        period: '2011 Q2',
                        teaching: 5670,
                        experience: 4293,
                        challenge: 1881
                    }, {
                        period: '2011 Q3',
                        teaching: 4820,
                        experience: 3795,
                        challenge: 1588
                    }, {
                        period: '2011 Q4',
                        teaching: 15073,
                        experience: 5967,
                        challenge: 5175
                    }, {
                        period: '2012 Q1',
                        teaching: 10687,
                        experience: 4460,
                        challenge: 2028
                    }, {
                        period: '2012 Q2',
                        teaching: 8432,
                        experience: 5713,
                        challenge: 1791
                    }];
            }
        }, true);

    }

    function areaChart(){
        return {
            restrict: 'E',
            template: '<div></div>',
            scope: {
                areadata: '=',
                xkey: '=',
                ykeys: '=',
                labels: '='
            },
            replace: true,
            link:function($scope,element)
            {
                $scope.statesArea = {};

                var displayArea = function () {

                    if($scope.areadata.length !== 0)
                    {
                        if(angular.equals({}, $scope.statesArea))
                        {
                            $scope.statesArea = Morris.Area({
                                element: element,
                                data: $scope.areadata,
                                xkey: $scope.xkey,
                                ykeys: $scope.ykeys,
                                labels: $scope.labels,
                                pointSize: 2,
                                hideHover: 'auto',
                                resize: true
                            });
                        }
                        else
                        {
                            $scope.statesArea.setData($scope.areadata);
                        }
                    }
                };

                (function () {
                    displayArea();
                }());

                $scope.$watch('areadata', function(newValue, oldValue) {
                    displayArea();
                });

            }
        }
    }

}());
