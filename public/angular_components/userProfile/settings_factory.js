(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .factory('_AssignPoints', assignPoints)
        .factory('_ViewProfile', viewProfile)
        .directive('sortRecords', sortRecords)
        .directive('pageControl', pageControl)
        .directive('ngConfirmClick', ngConfirmClick);

    viewProfile.$inject = ['_AjaxRequest', '_Authentication'];
    function viewProfile(_AjaxRequest, _Authentication) {
        return {
            user: JSON.parse(window.localStorage.getItem('currentUser')),

            getUser: function () {
                return this.user;
            },

            setUser: function (user) {
                var currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
                this.user = user;

                _Authentication.setDisplayName(user);
            }
        };
    }

    function assignPoints() {
        return {

            users: [],

            setAssignees: function (users) {
                this.users = users;
            },
            
            getAssignees: function () {
                return this.users;
            },
            
            addPoints: function () {
                return this.users;
            },
            deletePoints: function () {
                return this.users;
            }
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
            templateUrl: 'angular_components/userProfile/pageController.html',
            link: function (scope) {

                scope.getTotalPagesNum = function () {
                    return Math.ceil($filter('filter')(scope.items, scope.searchrecord).length/scope.viewby);
                };

                scope.range = function (start) {
                    var end =  parseInt(start) + parseInt(scope.gap);
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
    
    function ngConfirmClick() {
        return {
            link: function (scope, element, attr) {
                element.bind('click',function (event) {
                    if ( window.confirm(attr.ngConfirmClick) ) {
                        scope.$eval(attr.confirmedClick)
                    }
                });
            }
        };
    }

}());
