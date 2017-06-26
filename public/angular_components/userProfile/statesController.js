(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('statesController', statesController)
        .directive('sortingTableHeader', sortingTableHeader);

    statesController.$inject = ['$scope', '_CheckAuthentication', '_AjaxRequest']; // dependency injection

    function statesController($scope, _CheckAuthentication, _AjaxRequest) {
        $scope.isAuthenticated = function () {
            return _CheckAuthentication.isAuthenticated();
        };

        $scope.getAccessLevel = function () {
            return _CheckAuthentication.getAccessLevel();
        };

        (function () {
            _AjaxRequest.get('/api/points/history')
                .then(
                    function successCallback(result) {
                        $scope.pointsHistoryData = result.data;
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                )
        }());
    };

    function sortingTableHeader($compile) {
        return {
            link: function(scope, element, attrs) {
                var tableHeaderEles = angular.element( element[0].querySelectorAll('th') );
                angular.forEach(tableHeaderEles, function(tableHeaderEle) {
                    var thElement = angular.element(tableHeaderEle);
                    var thValue = thElement.text();
                    var sortIcon = '<span class="fa" ng-class="{\'fa-sort\': sortType != \'' + thValue + '\', \'fa-caret-down\': sortType == \'' + thValue + '\' && !sortReverse, \'fa-caret-up\': sortType == \'' + thValue + '\' && sortReverse}"></span>';
                    thElement.append($compile(sortIcon)(scope));
                });
            }
        };
    }
}());
