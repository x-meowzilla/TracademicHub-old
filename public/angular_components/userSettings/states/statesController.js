(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('statesController', statesController)
        .directive('areaChart', areaChart);

    statesController.$inject = ['$scope', '$uibModal', '$filter', '_Authentication', '_AjaxRequest']; // dependency injection

    function statesController($scope, $uibModal, $filter, _Authentication, _AjaxRequest) {
        $scope.getCurrentUser = function () {
            return _Authentication.getLoginUser();
        };

        $scope.getDisplayName = function (){
            return _Authentication.getDisplayName();
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
        $scope.$watch('timePeriod', function(newValue, oldValue) {
            if(newValue.startDate > newValue.endDate)
            {
                $scope.endDatePicker.minDate = newValue;
                $scope.timePeriod.endDate = newValue;
            }

            if(!angular.isUndefined($scope.timePeriod))
            {
                getDataList();
            }
        }, true);

        // Morris data
        var getDataList = function () {
            _AjaxRequest.get('/api/points/period?' + $.param({userID: $scope.getCurrentUser()._id, startDate: $scope.timePeriod.startDate, endDate: $scope.timePeriod.endDate}), true)
                .then(
                    // change to get leader board rank endpoint, get userID
                    function successCallback(result) {
                        if(!result.data || result.data.length === 0)
                        {
                            $scope.areadata = [];
                            $scope.ykeys = [];
                            $scope.labels = [];
                        }

                        var areaDataObjTemplate = {"period": ''};
                        var loopCount = 0;

                        // todo: not a good design, need to fix getPointsByPeriod in Point.js and remove this part
                        var categorieNames = [];
                        var dates = [];
                        var pointInfo = [];
                        var pointsData = angular.copy(result.data);
                        angular.forEach(pointsData, function (data) {
                            _AjaxRequest.get('/api/points-category?' + $.param({_id: data.category}))
                                .then(
                                    function successCallback(res) {
                                        loopCount += 1;

                                        // get all categories
                                        if (categorieNames.indexOf(res.data[0].name) < 0) {
                                            categorieNames.push(res.data[0].name);
                                        }

                                        data.categoryName = res.data[0].name;
                                        areaDataObjTemplate[res.data[0].name] = 0;

                                        // get all dates
                                        if (dates.indexOf(data.date) < 0) {
                                            dates.push(data.date);
                                        }

                                        // for last loop
                                        if (loopCount === result.data.length)
                                        {
                                            var areadata = [];
                                            angular.forEach(pointsData, function (each) {
                                                var eachDate = $filter('date')(each.date, "yyyy-MM-dd");
                                                var dateObj = $filter('filter')(areadata, {'period': eachDate});

                                                if(dateObj.length > 0)
                                                {
                                                    dateObj[0][each.categoryName] = each.totalPoints;
                                                }
                                                else
                                                {
                                                    var areaDataObjT = angular.copy(areaDataObjTemplate);

                                                    areaDataObjT['period'] = eachDate;
                                                    areaDataObjT[each.categoryName] = each.totalPoints;
                                                    areadata.push(areaDataObjT);
                                                }
                                            });

                                            $scope.areadata = areadata;
                                            $scope.labels = categorieNames;
                                            $scope.ykeys = categorieNames;
                                        }
                                    },
                                    function errorCallback(error) {
                                        console.error(error);
                                    }
                                );
                        });
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                );
        };



        $scope.items = [];
        $scope.courses = [];

        var renderData = function () {
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
        };

        (function () {
            // initial time period
            var startDate = new Date();
            var endDate = new Date();
            startDate.setDate(endDate.getDate()-30);
            $scope.timePeriod.startDate = startDate;
            $scope.timePeriod.endDate = endDate;

            // get points line chart
            renderData();
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



        // Area Chart
        $scope.areadata = [];
        $scope.xkey = "period";
        $scope.ykeys = [];
        $scope.labels = [];

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
