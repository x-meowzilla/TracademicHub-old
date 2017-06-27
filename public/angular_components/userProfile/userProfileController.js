(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('userProfileController', userProfileController)
        .factory('_DataTableFactory', dataTableFactory)
        .directive('sortRecords', sortRecords);

    dataTableFactory.$inject = ['$filter'];
    function dataTableFactory($filter) {
        return{
            viewby : '5',
            gap: 5,
            items: [],
            searchRecord: '',
            currentPage: 1,

            getTotalPagesNum : function () {
                return Math.ceil($filter('filter')(this.items, this.searchRecord).length/this.viewby);
            },

            range : function (start) {
                var end =  start + this.gap;
                var size = this.getTotalPagesNum(this.items, this.searchRecord);
                var ret = [];

                if (size < end) {
                    end = size + 1;
                    start = size > this.gap ? size - this.gap : 1;
                }
                for (var i = start; i < end; i++) {
                    ret.push(i);
                }
                return ret;
            },

            setPage : function (page) {
                if (page < 1 || page > this.getTotalPagesNum(this.items, this.searchRecord)) {
                    return;
                }

                // get pager object
                this.currentPage = page;
            }
        }
    }

    function userProfileController($scope, _CheckAuthentication) {
        $scope.isAuthenticated = function () {
            return _CheckAuthentication.isAuthenticated();
        };

        $scope.getAccessLevel = function () {
            return _CheckAuthentication.getAccessLevel();
        };

    }

    function sortRecords() {
        return {
            restrict: 'A',
            transclude: true,
            scope: {
                order: '@',
                sort: '@'
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
