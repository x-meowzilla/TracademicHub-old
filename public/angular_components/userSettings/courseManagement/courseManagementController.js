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



        // page controller settings
        $scope.sort = {
            sortingOrder : '',
            reverse : false
        };
        $scope.viewby = '10';
        $scope.currentpage = 1;
        $scope.operations = [10, 20, 30];
        $scope.searchrecord = '';

    }

}());
