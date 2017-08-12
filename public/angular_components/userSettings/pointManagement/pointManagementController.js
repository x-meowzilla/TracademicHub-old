(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('pointManagementController', pointManagementController);

    pointManagementController.$inject = ['$scope', '_AjaxRequest', '_Authentication', 'PRIVILEGE', '_AssignPoints']; // dependency injection

    function pointManagementController($scope, _AjaxRequest, _Authentication, PRIVILEGE, _AssignPoints) {
        $scope.authorizedPrivilege = PRIVILEGE;
        $scope.isAuthorized = function (value) {
            // todo: hard-coded for now, need to udpate when server side access privilege checking apis finished.
            return _Authentication.isAuthorized(value);
        };

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
            // get categories
            getAllCategories();

            // get courses
            if(_Authentication.getLoginUser().isLocalUser)
            {
                // local admin can get view all courses
                _AjaxRequest.get('/api/courses?' + $.param({isActive: true}))
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
                        _AjaxRequest.get('/api/courses?' + $.param({_id: courseId, isActive: true}))
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
            };
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

        $scope.clearAllAssignees = function () {
            _AssignPoints.setAssignees([]);
            $scope.users = [];
        };
        
        $scope.removeAssignee = function (assignee) {
            $scope.users = $scope.users.filter(function (item) {
                return item._id !== assignee._id;
            });
            _AssignPoints.setAssignees($scope.users);
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
                $scope.assigneeExist = false;
                angular.forEach($scope.users, function (user) {
                    if(user.studentNumber.toString() === studentNum.toString())
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
                        console.log(category);
                        _AjaxRequest.post('/api/points',
                            {assigneeID: user._id, pointValue: category.point, pointCategoryID: category._id}, true)
                            .then(
                                function successCallback(result) {
                                    // todo: assign point successfully banner
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
