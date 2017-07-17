(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .factory('_AssignPoints', assignPoints)
        .factory('_ViewProfile', viewProfile)
        .directive('sortRecords', sortRecords)
        .directive('pageControl', pageControl)
        .directive('confirmClick', confirmClick);

    viewProfile.$inject = ['_AjaxRequest'];
    function viewProfile(_AjaxRequest) {
        return {
            user: JSON.parse(window.localStorage.getItem('currentUser')),

            getUser: function () {
                return this.user;
            },

            setUser: function (userId) {
                var currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
                if (userId === currentUser._id)
                {
                    return currentUser;
                }
                // _AjaxRequest.get('/api/points/history')
                //     .then(
                //         function successCallback(result) {
                //             return result.data;
                //         },
                //         function errorCallback(error) {
                //             console.error(error);
                //         }
                //     )
                this.user = {"_id":userId,"utorid":"admin1","email":"adminabc@tracademichub.com","name":{"preferredName":"kkk","firstName":"asfva","lastName":"jgdf"},"accessPrivilege":"59544c9117b4fb4805c4d941","biography":"","lastLoginDate":"2017-06-29T17:07:04.837Z"};
                return this.user;
            }
        };
    }

    function assignPoints() {
        return {

            users: [],

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
    
    function confirmClick() {
        return {
            link: function (scope, element, attr) {
                var msg = attr.confirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
    }

}());
