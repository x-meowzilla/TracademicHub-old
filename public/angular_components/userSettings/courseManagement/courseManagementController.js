(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('courseManagementController', courseManagementController);

    courseManagementController.$inject = ['$scope', '$filter', '_AjaxRequest']; // dependency injection

    function courseManagementController($scope, $filter, _AjaxRequest) {
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
            $scope.endDatePicker.minDate = newValue;
            $scope.coursePeriod.endDate = newValue;
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



        // edit course form
        $scope.form = {};
        $scope.setStartDatePicker = function (editCourse) {
            editCourse.startDatePicker = {};
            editCourse.startDatePicker.show=false;
            editCourse.startDatePicker.minDate=new Date()
        };
        $scope.setEndDatePicker = function (editCourse) {
            editCourse.endDatePicker = {};
            editCourse.endDatePicker.show=false;
            editCourse.endDatePicker.minDate=new Date()
        };
        $scope.resetEndDate = function (editCourse) {
            editCourse.endDatePicker.minDate = editCourse.startDateObj;
            editCourse.endDateObj = editCourse.startDateObj;
        };
        $scope.updateCourseInfo = function (course, updateCourse) {
            if($scope.form.editCourseForm.$dirty)
            {
                var updatedCourse = {};
                updatedCourse["startDate"] = updateCourse.startDateObj;
                updatedCourse["endDate"] = updateCourse.endDateObj;

                if($scope.form.editCourseForm.description.$dirty)
                {
                    updatedCourse["description"] = updateCourse.description;
                }
                else if($scope.form.editCourseForm.academicTerm.$dirty)
                {
                    updatedCourse["academicTerm"] = updateCourse.academicTerm;
                }

                console.log(updatedCourse);
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
            $scope.form.editCourseForm.$setPristine();
            $scope.form.editCourseForm.$setUntouched();
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
