(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('statesController', statesController)
        .directive('areaChart', areaChart);

    statesController.$inject = ['$scope', '$uibModal', '_Authentication', '_AjaxRequest']; // dependency injection

    function statesController($scope, $uibModal , _Authentication, _AjaxRequest) {
        $scope.getCurrentUser = function () {
            return _Authentication.getLoginUser();
        };

        $scope.getDisplayName = function (){
            return _Authentication.getDisplayName();
        };


        $scope.items = [];
        $scope.courses = [];

        (function () {
            // get point history
            _AjaxRequest.get('/api/points?' + $.param({assigneeID: $scope.getCurrentUser()._id}))
                .then(
                    // change to get leader board rank endpoint, get userID
                    function successCallback(result) {
                        $scope.items = result.data;
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                );

            // // get the courses that current user has access to.
            // var courseIds = [];
            // angular.forEach($scope.currentUser.courseEnrolled, function (item) {
            //     var courseId = item.course._id;
            //     if(courseIds.indexOf(courseId) < 0)
            //     {
            //         _AjaxRequest.get('/api/courses?' + $.param({_id: courseId, isActive: true}))
            //             .then(
            //                 function successCallback(result) {
            //                     if(result.data.length > 0)
            //                     {
            //                         $scope.courses.push(result.data[0]);
            //                         courseIds.push(result.data[0]._id);
            //                     }
            //                 },
            //                 function errorCallback(error) {
            //                     console.error(error);
            //                 }
            //             );
            //     }
            // });
        }());



        $scope.sort = {
            sortingOrder : '',
            reverse : false
        };
        $scope.viewby = '5';
        $scope.currentpage = 1;
        $scope.operations = [5, 10, 20];
        $scope.searchrecord = '';


        // assigner's user card
        $scope.openUserProfileModal = function(userID) {
            _AjaxRequest.get('/api/users?' + $.param({isActive: true, _id: userID}))
                .then(
                    function successCallback(result) {
                        if(result.data)
                        {
                            var modalInstance = $uibModal.open({
                                templateUrl : 'angular_components/userSettings/common/userSettingsModals/userCard/userCardModal.html',
                                controller : 'userCardController',
                                resolve : {
                                    currentUser : function() {
                                        return result.data[0];
                                    }
                                }
                            });
                        }

                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                );
        };



        $scope.startDatePicker = {
            show: false
        };
        $scope.endDatePicker = {
            show: false
        };
        $scope.timePeriod = {
            startDate: new Date(),
            endDate: new Date()
        };
        $scope.$watch('timePeriod.startDate', function(newValue, oldValue) {
            if(newValue > $scope.timePeriod.endDate)
            {
                $scope.endDatePicker.minDate = newValue;
                $scope.timePeriod.endDate = newValue;
            }
        }, true);



        // Morris data
        var getDataList = function () {
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
                                    data['period'] = category.name;
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

        // Area Chart
        $scope.areadata = getDataList();
        $scope.xkey = "period";
        $scope.ykeys = ['teaching', 'experience', 'challenge'];
        $scope.labels = ['teaching points', 'experience points', 'challenge points'];

        // $scope.$watch('selectedCourseArea', function(newValue, oldValue) {
        //     if(newValue !== oldValue)
        //     {
        //         $scope.areadata = angular.isUndefined(newValue) ?
        //             [] :
        //             getDataList();
        //     }
        // }, true);

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
