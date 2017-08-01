(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('pointManagementController', pointManagementController)
        .directive('categoryCard', categoryCard);

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

        (function () {
            getAllCategories();
        }());

        //add new point category
        $scope.addPointCategory = function (name, description) {
            _AjaxRequest.put('/api/points-category', {description: description})
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


        $scope.addAssignee = function (studentNum) {
            if(studentNum)
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
        };
        
        $scope.assignPoints = function () {
            if(studentNum)
            {
                angular.forEach($scope.getAssignedPoints(), function (category) {
                    _AjaxRequest.get('/api/users?' + $.param({isActive: true, studentNumber: studentNum}))
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
            }
        }

    }

    function categoryCard(){
        return {
            restrict: 'A',
            transclude: true,
            template :
            '<div class="col-md-4 col-sm-6 col-xs-12">' +
            '<div class="panel panelBorder categoryPanel">' +
            '<div class="panel-heading">' +
            '<h2 class="panel-title pull-left">{{category._id}}</h2>' +
            '<button class="btn btn-danger btn-xs pull-right" ng-confirm-click="Are you sure to delete this point category?" confirmed-click="deletePointCategory(category)">' +
            '<span class="glyphicon glyphicon-trash"></span>' +
            '</button>' +
            '</div>' +
            '<div class="panel-body">' +
            '<div class="categoryDescription">{{category.description}}</div>' +
            '<hr>' +
            '<div class="input-group">' +
            '<span class="input-group-addon">Enter points: </span>' +
            '<input type="number" min="0" class="form-control" ng-model="category.point"/>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>',
            link: function(scope) {


            }
        }
    }

}());
