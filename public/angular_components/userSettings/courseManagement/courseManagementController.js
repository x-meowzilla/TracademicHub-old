(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('courseManagementController', courseManagementController);

    courseManagementController.$inject = ['$scope', '_AjaxRequest']; // dependency injection

    function courseManagementController($scope, _AjaxRequest) {
        $scope.courses = [];
        var getCourses = function (displayType) {
            _AjaxRequest.get('/api/courses')
                .then(
                    function successCallback(result) {
                        $scope.courses = result.data.filter(function (item) {
                            if(displayType === 'active')
                            {
                                return item.isActive;
                            }
                            else if(displayType === 'inactive')
                            {
                                return !item.isActive;
                            }
                            else
                            {
                                return item;
                            }
                        });
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                );
        };
        $scope.getCourses = function (displayType) {
            getCourses(displayType);
        };

        (function () {
            getCourses('active');
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



        $scope.showDatePicker = {
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
        $scope.displayDateString = function (date) {
            return date.toDateString();
        };

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
        $scope.createCourse = function () {
            // req.body = {startDate, endDate, name, description, academicTerm (Fall, Winter, Summer, etc), userPrivileges}

            _AjaxRequest.put('/api/local-register/', $scope.editUserInfo)
                .then(
                    function successCallback(result) {
                        $scope.clearForm();
                        angular.element("#addUserModal").modal('hide');
                        getUsers();
                    },
                    function errorCallback(error) {
                        if(error.status === 409)
                        {
                            $scope.utoridExist = true;
                        }
                    }
                );
        };



        $scope.editCourse = false;
        $scope.updateCourseInfo = function (course) {
            
        }
    }

}());
