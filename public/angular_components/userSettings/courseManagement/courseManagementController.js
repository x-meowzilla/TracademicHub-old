(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('courseManagementController', courseManagementController);

    courseManagementController.$inject = ['$scope', '_AjaxRequest']; // dependency injection

    function courseManagementController($scope, _AjaxRequest) {
        $scope.courses = [];
        $scope.editCourses = [];

        $scope.displayType = 'active';
        var getCourses = function () {
            _AjaxRequest.get('/api/courses')
                .then(
                    function successCallback(result) {
                        $scope.courses = result.data.filter(function (item) {
                            if($scope.displayType === 'active')
                            {
                                return item.isActive;
                            }
                            else if($scope.displayType === 'inactive')
                            {
                                return !item.isActive;
                            }
                            else
                            {
                                return item;
                            }
                        });
                        $scope.editCourses = angular.copy($scope.courses);
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



        $scope.displayDateString = function (date) {
            return date.toDateString();
        };
        $scope.startDatePicker = {
            minDate: new Date(),
            show: false
        };
        $scope.endDatePicker = {
            minDate: new Date(),
            show: false
        };
        $scope.$watch('eachCourse.startDate', function(newValue, oldValue) {
            $scope.endDatePicker.minDate = newValue;
            $scope.eachCourse.endDate = newValue;
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

        $scope.eachCourse = {
            startDate: new Date(),
            endDate: new Date(),
            name: '',
            academicTerm: '',
            description: '',
            userPrivileges: $scope.userPrivileges
        };
        $scope.editUserInfoOrign = angular.copy($scope.eachCourse);
        $scope.createCourse = function () {
            _AjaxRequest.put('/api/courses', $scope.eachCourse, true)
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
                    }
                );
        };
        $scope.clearAddCourseForm = function () {
            $scope.eachCourse = angular.copy($scope.editUserInfoOrign);
            $scope.eachCourseForm.$setPristine();
            $scope.eachCourseForm.$setUntouched();
        };



        $scope.startDatePickerTwo = {
            minDate: new Date(),
            show: false
        };
        $scope.endDatePickerTwo = {
            minDate: new Date(),
            show: false
        };
        $scope.$watch('editCourses.startDate', function(newValue, oldValue) {
            $scope.endDatePickerTwo.minDate = newValue;
            $scope.editCourses.endDate = newValue;
        }, true);
        $scope.updateCourseInfo = function (course) {
            if($scope.editCourseForm.$dirty)
            {
                var updatedCourse = {};
                updatedCourse["startDate"] = $scope.editCourses.startDate;
                updatedCourse["endDate"] = $scope.editCourses.endDate;

                if($scope.editCourseForm.description.$dirty)
                {
                    updatedCourse["description"] = $scope.editCourses.description;
                }
                else if($scope.editCourseForm.academicTerm.$dirty)
                {
                    updatedCourse["academicTerm"] = $scope.editCourses.academicTerm;
                }

                _AjaxRequest.patch('/api/courses/' + course._id + '/update?' + $.param(updatedCourse))
                    .then(
                        function successCallback(result) {
                            getCourses();
                            // todo: profile updated banner
                        },
                        function errorCallback(error) {
                            console.error(error);
                        }
                    );
            }
        };
        $scope.clearEditCourseForm = function () {
            $scope.editCourses = angular.copy($scope.courses);
            $scope.editCourseForm.$setPristine();
            $scope.editCourseForm.$setUntouched();
        };


        // delete/deactive course
        $scope.deleteCourse = function (course) {
            _AjaxRequest.patch('/api/courses/' + course._id + '/update?' + $.param({isActive: false}))
                .then(
                    function successCallback(result) {
                        $scope.courses = $scope.courses.filter(function (item) {
                            return item._id !== result.data._id;
                        });
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                )
        };
    }

}());
