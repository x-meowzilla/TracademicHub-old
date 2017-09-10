(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('courseManagementController', courseManagementController)
        .directive('courseCard', courseCard);

    courseManagementController.$inject = ['$scope', '$filter', '_AjaxRequest']; // dependency injection

    function courseManagementController($scope, $filter, _AjaxRequest) {
        $scope.courses = [];
        $scope.editCourses = [];
        $scope.activeCourses = [];

        $scope.displayType = 'active';
        var getCourses = function () {
            var courseParam = {};
            if($scope.displayType === 'active')
            {
                courseParam['isActive'] = true;
            }
            else if($scope.displayType === 'inactive')
            {
                courseParam['isActive'] = false;
            }
            _AjaxRequest.get('/api/courses?' + $.param(courseParam))
                .then(
                    function successCallback(result) {
                        $scope.courses = result.data;
                        $scope.editCourses = angular.copy($scope.courses);
                        $scope.activeCourses = angular.copy($scope.courses);
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                );
        };
        $scope.getCourses = function (displayType) {
            $scope.displayType = displayType;
            getCourses();
        };

        (function () {
            getCourses();
        }());

        $scope.getUserPrivilegesList = function (userPrivileges) {
            var result = "| ";
            angular.forEach(userPrivileges, function (privilege) {
                result = result + privilege.name + " | ";
            });
            return result;
        };



        // page controller settings
        $scope.sort = {
            sortingOrder : '',
            reverse : false
        };
        $scope.viewby = '10';
        $scope.currentpage = 1;
        $scope.operations = [10, 20, 30];
        $scope.searchrecord = '';



        // add course modal
        $scope.startDatePicker = {
            minDate: new Date(),
            show: false
        };
        $scope.endDatePicker = {
            minDate: new Date(),
            show: false
        };
        $scope.$watch('coursePeriod.startDate', function(newValue, oldValue) {
            if(newValue > $scope.coursePeriod.endDate)
            {
                $scope.endDatePicker.minDate = newValue;
                $scope.coursePeriod.endDate = newValue;
            }
        }, true);

        $scope.userPrivileges = [];
        (function () {
            _AjaxRequest.get('/api/privileges/')
                .then(
                    function successCallback(result) {
                        $scope.userPrivileges = result.data;
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                )
        }());

        $scope.coursePeriod = {
            startDate: new Date(),
            endDate: new Date()
        };
        $scope.eachCourse = {
            startDate: '',
            endDate: '',
            name: '',
            academicTerm: '',
            description: ''
            // userPrivileges: [] TODO: when server add custom user privileges feature
        };
        $scope.editUserInfoOrign = angular.copy($scope.eachCourse);
        $scope.createCourse = function () {
            // $scope.eachCourse.userPrivileges = $scope.userPrivileges; TODO: when server add custom user privileges feature
            $scope.eachCourse.startDate = $filter('date')($scope.coursePeriod.startDate, 'yyyy-MM-dd');
            $scope.eachCourse.endDate = $filter('date')($scope.coursePeriod.endDate, 'yyyy-MM-dd');
            _AjaxRequest.put('/api/courses', $scope.eachCourse)
                .then(
                    function successCallback(result) {
                        $scope.clearAddCourseForm();
                        angular.element("#addCourseModal").modal('hide');
                        getCourses();
                    },
                    function errorCallback(error) {
                        if(error.status === 409)
                        {
                            $scope.utoridExist = true;
                        }
                        console.error(error);
                    }
                );
        };
        $scope.clearAddCourseForm = function () {
            $scope.eachCourse = angular.copy($scope.editUserInfoOrign);
            $scope.eachCourseForm.$setPristine();
            $scope.eachCourseForm.$setUntouched();
        };
    }


    courseCard.$inject = ['_AjaxRequest'];
    function courseCard(_AjaxRequest) {
        return {
            restrict: 'EA',
            scope: {
                course: '=',
                displayType: '=',
                getCourses: '&'
            },
            templateUrl:'angular_components/userSettings/common/userSettingsModals/courseModal.html',
            link: function($scope) {
                $scope.editCourse = angular.copy($scope.course);
                $scope.editCourse.editCourse = false;

                $scope.setStartDatePicker = function (course) {
                    course.startDatePicker = {};
                    course.startDatePicker.show=false;
                    course.startDatePicker.minDate=new Date()
                };
                $scope.setEndDatePicker = function (course) {
                    course.endDatePicker = {};
                    course.endDatePicker.show=false;
                    course.endDatePicker.minDate=new Date()
                };
                $scope.resetEndDate = function (course) {
                    course.endDatePicker.minDate = course.startDateObj;
                    course.endDateObj = course.startDateObj;
                };


                $scope.getUserPrivilegesList = function (userPrivileges) {
                    var result = "| ";
                    angular.forEach(userPrivileges, function (privilege) {
                        result = result + privilege.name + " | ";
                    });
                    return result;
                };


                $scope.dateUpdated = false;
                $scope.updateCourse = false;
                $scope.activeCourse = false;

                // edit course
                $scope.updateCourseInfo = function () {
                    if($scope.editCourseForm.$dirty)
                    {
                        var updatedCourse = {};
                        updatedCourse["startDate"] = $scope.editCourse.startDateObj ?
                            $scope.editCourse.startDateObj : $scope.course.startDate;
                        updatedCourse["endDate"] = $scope.editCourse.endDateObj ?
                            $scope.editCourse.endDateObj: $scope.course.endDate;

                        if($scope.editCourseForm.description.$dirty)
                        {
                            updatedCourse["description"] = $scope.editCourse.description;
                        }
                        else if($scope.editCourseForm.academicTerm.$dirty)
                        {
                            updatedCourse["academicTerm"] = $scope.editCourse.academicTerm;
                        }

                        _AjaxRequest.patch('/api/courses/' + $scope.editCourse._id + '/update?' + $.param(updatedCourse))
                            .then(
                                function successCallback(result) {
                                    // active inactive user
                                    if($scope.dateUpdated && $scope.displayType === 'inactive')
                                    {
                                        _AjaxRequest.patch('/api/courses/' + $scope.editCourse._id + '/update?' + $.param({isActive: true}))
                                            .then(
                                                function successCallback(result) {
                                                    $scope.activeCourse = true;

                                                    var activeBanner = function () {
                                                        $scope.activeCourse = false;
                                                    };
                                                    $timeout(activeBanner,3000);
                                                },
                                                function errorCallback(error) {
                                                    console.error(error);
                                                }
                                            )
                                    }

                                    // todo: profile updated banner
                                    $scope.updateCourse = true;

                                    var updateBanner = function () {
                                        $scope.updateCourse = false;
                                    };
                                    $timeout(updateBanner,3000);
                                    $scope.getCourses();
                                },
                                function errorCallback(error) {
                                    console.error(error);
                                }
                            );
                    }
                };


                // delete/deactive course
                $scope.deleteCourse = function () {
                    _AjaxRequest.patch('/api/courses/' + $scope.editCourse._id + '/update?' + $.param({isActive: false}))
                        .then(
                            function successCallback(result) {
                                $scope.getCourses();
                            },
                            function errorCallback(error) {
                                console.error(error);
                            }
                        )
                };


                $scope.clearForm = function () {
                    $scope.editCourse = angular.copy($scope.course);
                    $scope.editCourseForm.$setPristine();
                    $scope.editCourseForm.$setUntouched();
                };
            }
        }
    }

}());
