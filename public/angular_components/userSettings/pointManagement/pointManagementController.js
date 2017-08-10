(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('pointManagementController', pointManagementController);

    pointManagementController.$inject = ['$scope', '$timeout', '_AjaxRequest', '_AssignPoints']; // dependency injection

    function pointManagementController($scope, $timeout, _AjaxRequest, _AssignPoints) {

        var getAllCategories = function () {
            _AjaxRequest.get('/api/points-category/')
                .then(
                    function successCallback(result) {
                        $scope.categories = result.data;
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                );
        };

        $scope.categories = [];
        $scope.courses = [];

        (function () {
            getAllCategories();

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

        //add new point category
        $scope.addPointCategory = function (name, description) {
            _AjaxRequest.put('/api/points-category', {name: name, description: description})
                .then(
                    function successCallback(result) {
                        getAllCategories();
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                );
        };

        // delete point category
        $scope.deletePointCategory = function (category) {
            _AjaxRequest.delete('/api/points-category?' + $.param({_id: category._id}))
                .then(
                    function successCallback(result) {
                        getAllCategories();
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                );
        };

        $scope.users = _AssignPoints.getAssignees();

        $scope.clearSelectedUser = function () {
            _AssignPoints.setAssignees([]);
            $scope.users = [];
        };
        
        $scope.removeAssignee = function (assignee) {
            $scope.users = $scope.users.filter(function (item) {
                return item._id !== assignee._id;
            });
        };

        $scope.getAssignedPoints = function () {
            var res = [];
            angular.forEach($scope.categories, function (category) {
                if(category.point)
                {
                    res.push({"id": category._id, "point": category.point});
                }
            });

            return res;
        };


        $scope.addAssigneeFailed = false;
        $scope.assigneeExist = false;
        $scope.$watch('studentNum', function(newValue, oldValue) {
            $scope.addAssigneeFailed = false;
            $scope.assigneeExist = false;
        }, true);
        $scope.addAssignee = function (studentNum) {
            if(studentNum)
            {
                angular.forEach($scope.users, function (user) {
                    if(user.studentNumber.toString() === studentNum.toString() && !$scope.assigneeExist)
                    {
                        $scope.assigneeExist = true;
                    }
                });

                if(!$scope.assigneeExist)
                {
                    _AjaxRequest.get('/api/users?' + $.param({isActive: true, studentNumber: studentNum}))
                        .then(
                            function successCallback(result) {
                                if(result.data.length === 1)
                                {
                                    $scope.users.push(result.data[0]);
                                }
                                else if(result.data.length === 0)
                                {
                                    // TODO: pop up user does not exist or user is inactive message.
                                    $scope.addAssigneeFailed = true;
                                }
                                else
                                {
                                    console.error('One student number should only refer to one student.');
                                }
                            },
                            function errorCallback(error) {
                                console.error(error);
                            }
                        );
                }
            }
        };
        
        $scope.assignPoints = function (selectedCourse) {
            if(selectedCourse)
            {
                angular.forEach($scope.users, function (user) {
                    angular.forEach($scope.getAssignedPoints(), function (category) {
                        _AjaxRequest.get('/api/users?' + $.param({isActive: true, studentNumber: user.studentNumber}))
                            .then(
                                function successCallback(user) {
                                    _AjaxRequest.post('/api/points',
                                        {assigneeID: user._id, pointValue: category.point, pointCategoryID: category._id})
                                        .then(
                                            function successCallback(result) {
                                                getAllCategories();
                                            },
                                            function errorCallback(error) {
                                                console.error(error);
                                            }
                                        );
                                },
                                function errorCallback(error) {
                                    console.error(error);
                                }
                            );
                    });
                });
            }
        }

    }

}());
