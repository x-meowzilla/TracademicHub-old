(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('statesController', statesController)
        .directive('sortRecords', sortRecords);

    statesController.$inject = ['$scope', '_CheckAuthentication', '_AjaxRequest', '$filter']; // dependency injection

    function statesController($scope, _CheckAuthentication, _AjaxRequest, $filter) {
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


        $scope.viewby = '5';

        $scope.sort = {
            sortingOrder : '',
            reverse : false
        };

        $scope.items = [];


        $scope.pager = {
            currentPage: 1,
            gap: 5
        }
        
        $scope.getTotalPagesNum = function () {
            return Math.ceil($filter('filter')($scope.items, $scope.searchRecord).length/$scope.viewby);
        }

        $scope.range = function (start, gap) {
            var end =  start + gap;
            var size = $scope.getTotalPagesNum();
            var ret = [];

            if (size < end) {
                end = size + 1;
                start = size > gap ? size - $scope.pager.gap : 1;
            }
            for (var i = start; i < end; i++) {
                ret.push(i);
            }
            return ret;
        };

        $scope.setPage = function (page) {
            if (page < 1 || page > $scope.getTotalPagesNum()) {
                return;
            }

            // get pager object
            $scope.pager.currentPage = page;

            var startIdx = (page - 1) * $scope.viewby - 1;
            var endIdx = page * $scope.viewby;
        }
    };

    function sortRecords() {
        return {
            restrict: 'A',
            transclude: true,
            scope: {
                order: '@',
                sort: '='
            },
            template :
            ' <i ng-click="sort_by(order)">'+
            '    <span ng-transclude></span>'+
            '    <i ng-class="selectedCls(order)"></i>'+
            '</i>',
            link: function(scope) {
                // change sorting order
                scope.sort_by = function(newSortingOrder) {
                    var sort = scope.sort;

                    if (sort.sortingOrder == newSortingOrder){
                        sort.reverse = !sort.reverse;
                    }

                    sort.sortingOrder = newSortingOrder;
                };


                scope.selectedCls = function(column) {
                    if(column == scope.sort.sortingOrder){
                        return ('fa fa-caret-' + ((!scope.sort.reverse) ? 'down' : 'up'));
                    }
                    else{
                        return'fa fa-sort'
                    }
                };
            }
        }
    }
}());
