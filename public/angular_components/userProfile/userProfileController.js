(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('userProfileController', userProfileController)
        .directive('sortRecords', sortRecords)
        .directive('pageControl', pageControl);

    function userProfileController($scope, _CheckAuthentication) {
        $scope.isAuthenticated = function () {
            return _CheckAuthentication.isAuthenticated();
        };

        $scope.getAccessLevel = function () {
            return _CheckAuthentication.getAccessLevel();
        };

    }

    pageControl.$inject = ['$filter'];
    function pageControl($filter) {
        return {
            restrict: 'A',
            transclude: true,
            scope: {
                gap: '@',
                viewby: '=',
                operations: '=',
                currentpage: '=',
                items: '=',
                searchrecord: '='
            },
            template:
            '<!--select number of displayed rows-->' +
            '<div class="row gridHead">' +
            '<div class="col-sm-3">' +
            '<div class="grid-option-setting">' +
            '<strong>Show' +
            '<select ng-model="viewby" class="select-width" ng-change="setPage(1)">' +
            '<option ng-repeat="op in operations">{{op}}</option>' +
            '</select> entries' +
            '</strong></div>' +
            '</div>' +
            '<!--search bar-->' +
            '<div class="col-sm-5 pull-right">' +
            '<div class="input-group">' +
            '<div class="input-group-addon"><i class="fa fa-search"></i></div>' +
            '<input type="text" class="form-control" placeholder="Search" ng-model="searchrecord">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-md-12">' +
            '<ng-transclude></ng-transclude>' +
            '<div class="row">' +
            '<div class="col-md-12">' +
            '<!--pagination controller-->' +
            '<ul class="pagination">' +
            '<li ng-class="{disabled:currentpage === 1}">' +
            '<a ng-click="setPage(1)">First</a>' +
            '</li>' +
            '<li ng-class="{disabled:currentpage === 1}">' +
            '<a ng-click="setPage(currentpage - 1)">Previous</a>' +
            '</li>' +
            '<li ng-repeat="page in range(currentpage)"' +
            'ng-class="{active:currentpage === page}">' +
            '<a ng-click="setPage(page)">{{page}}</a>' +
            '</li>' +
            '<li ng-class="{disabled:currentpage === getTotalPagesNum()}">' +
            '<a ng-click="setPage(currentpage + 1)">Next</a>' +
            '</li>' +
            '<li ng-class="{disabled:currentpage === getTotalPagesNum()}">' +
            '<a ng-click="setPage(getTotalPagesNum())">Last</a>' +
            '</li>' +
            '</ul>' +
            '<span class="pull-right"><strong>Showing {{(currentpage-1)*viewby}} to {{currentpage*viewby}} of {{items.length}} entities</strong></span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>',
            link: function (scope) {

                scope.getTotalPagesNum = function () {
                    return Math.ceil($filter('filter')(scope.items, scope.searchrecord).length/scope.viewby);
                };

                scope.range = function (start) {
                    var end =  start + scope.gap;
                    var size = scope.getTotalPagesNum(scope.items, scope.searchrecord);
                    var ret = [];

                    if (size < end) {
                        end = size + 1;
                        start = size > scope.gap ? size - scope.gap : 1;
                    }
                    for (var i = start; i < end; i++) {
                        ret.push(i);
                    }
                    return ret;
                };

                scope.setPage = function (page) {
                    if (page < 1 || page > scope.getTotalPagesNum(scope.items, scope.searchrecord)) {
                        return;
                    }

                    // get pager object
                    scope.currentpage = page;
                };
            }
        }
    }

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

                    if (sort.sortingOrder === newSortingOrder){
                        sort.reverse = !sort.reverse;
                    }

                    sort.sortingOrder = newSortingOrder;
                };


                scope.selectedCls = function(column) {
                    if(column === scope.sort.sortingOrder){
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
