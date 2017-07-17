(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('pointManagementController', pointManagementController)
        .directive('categoryCard', categoryCard);

    pointManagementController.$inject = ['$scope', '_AjaxRequest', '_AssignPoints']; // dependency injection

    function pointManagementController($scope, _AjaxRequest, _AssignPoints) {

        $scope.categories = [
            {"categoryName":"Teaching Points", "description": "blah blah description"},
            {"categoryName":"Experience Points", "description": "blah blah description"},
            {"categoryName":"Challenge Points", "description": "blah blah description"}
        ];

        $scope.users = _AssignPoints.getAssignees();

    }

    function categoryCard(){
        return {
            restrict: 'A',
            transclude: true,
            scope: {
                name: '=',
                description: '='
            },
            template :
            '<div class="col-md-4 col-sm-6 col-xs-12">' +
            '<div class="panel panelBorder categoryPanel">' +
            '<div class="panel-heading"><h2 class="panel-title">{{name}}</h2></div>' +
            '<div class="panel-body">' +
            '<div class="categoryDescription">{{description}}</div>' +
            '<hr>' +
            '<div class="input-group">' +
            '<span class="input-group-addon">Enter points: </span>' +
            '<input type="number" min="0" class="form-control">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>',
            link: function(scope) {


            }
        }
    }

}());
