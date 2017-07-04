(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('pointManagementController', pointManagementController)
        .directive('categoryCard', categoryCard);

    pointManagementController.$inject = ['$scope', '_CheckAuthentication', '_AjaxRequest', '_AssignPoints']; // dependency injection

    function pointManagementController($scope, _CheckAuthentication, _AjaxRequest, _AssignPoints) {
        $scope.isAuthenticated = function () {
            return _CheckAuthentication.isAuthenticated();
        };

        $scope.getAccessLevel = function () {
            return _CheckAuthentication.getAccessLevel();
        };

        $scope.categories = [
            {"categoryName":"Teaching Points", "description": "blah blah description"},
            {"categoryName":"Experience Points", "description": "blah blah description"},
            {"categoryName":"Challenge Points", "description": "blah blah description"}
        ];

        _AssignPoints.users = [{"_id":"59544e374609bf493b5c6023","utorid":"admin1","email":"admin1-test@tracademichub.com","name":{"preferredName":"asdfasd123123f","firstName":"asfva","lastName":"jgdf"},"accessPrivilege":"59544c9117b4fb4805c4d941","biography":"","lastLoginDate":"2017-06-29T17:07:04.837Z"},
            {"_id":"59544e374609bf493b5c6023","utorid":"admin1","email":"admin1-test@tracademichub.com","name":{"preferredName":"asdfasd123123f","firstName":"sv","lastName":"tr"},"accessPrivilege":"59544c9117b4fb4805c4d941","biography":"","lastLoginDate":"2017-06-29T17:07:04.837Z"},
            {"_id":"59544e374609bf493b5c6023","utorid":"admin1","email":"admin1-test@tracademichub.com","name":{"preferredName":"asdfasd123123f","firstName":"sv","lastName":"tr"},"accessPrivilege":"59544c9117b4fb4805c4d941","biography":"","lastLoginDate":"2017-06-29T17:07:04.837Z"},
            {"_id":"59544e374609bf493b5c6023","utorid":"admin1","email":"admin1-test@tracademichub.com","name":{"preferredName":"asdfasd123123f","firstName":"sv","lastName":"tr"},"accessPrivilege":"59544c9117b4fb4805c4d941","biography":"","lastLoginDate":"2017-06-29T17:07:04.837Z"},
            {"_id":"59544e374609bf493b5c6023","utorid":"admin1","email":"admin1-test@tracademichub.com","name":{"preferredName":"asdfasd123123f","firstName":"sv","lastName":"tr"},"accessPrivilege":"59544c9117b4fb4805c4d941","biography":"","lastLoginDate":"2017-06-29T17:07:04.837Z"},
            {"_id":"59544e374609bf493b5c6023","utorid":"admin1","email":"admin1-test@tracademichub.com","name":{"preferredName":"asdfasd123123f","firstName":"qwerasv","lastName":"gsdf"},"accessPrivilege":"59544c9117b4fb4805c4d941","biography":"","lastLoginDate":"2017-06-29T17:07:04.837Z"}];

        $scope.users = _AssignPoints.users;

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
            '<div class="col-xs-12">' +
            '<div class="col-xs-6">' +
            '<select class="assignPoints">' +
            '<option>None</option>' +
            '<option>Add Points</option>' +
            '<option>Delete Points</option>' +
            '</select>' +
            '</div>' +
            '<div class="col-xs-6">' +
            '<input type="number" min="0" class="assignPoints"/>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>',
            link: function(scope) {


            }
        }
    }

}());
