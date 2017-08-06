(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .factory('_AssignPoints', assignPoints)
        .directive('sortRecords', sortRecords)
        .directive('pageControl', pageControl)
        .directive('ngConfirmClick', ngConfirmClick)
        .directive('fileChanged', fileChanged)
        .directive('pwdCheck', pwdCheck)
        .directive('userCardModal', userCardModal)
        .directive('editProfile', editProfile);

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
            templateUrl: 'angular_components/userSettings/common/pageController.html',
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

    function ngConfirmClick() {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.bind('click',function (event) {
                    if ( window.confirm(attr.ngConfirmClick) ) {
                        scope.$eval(attr.confirmedClick)
                    }
                });
            }
        };
    }

    function fileChanged() {
        return {
            restrict: 'A',
            scope: {
                formname: '=',
                filename: '='
            },
            link: function(scope, element) {
                element.bind("change", function(changeEvent) {
                    var imageFile = changeEvent.target.files[0];
                    var reader = new FileReader();
                    reader.onload = function(loadEvent) {
                        scope.$apply(function() {
                            scope.filename = loadEvent.target.result;
                            scope.formname.$pristine = false;
                        });
                    }
                    reader.readAsDataURL(imageFile);
                });
            }
        }
    }
    
    function pwdCheck() {
        return {
            require: 'ngModel',
            scope: {
              password: "=pwdCheck"
            },
            link: function(scope, element, attributes, ngModel) {
                ngModel.$validators.matchPassword = function(modelValue) {
                    return modelValue === scope.password;
                };

                scope.$watch("password", function() {
                    ngModel.$validate();
                });
            }
        };
    }

    userCardModal.$inject = ['_AjaxRequest'];
    function userCardModal(_AjaxRequest) {
        return {
            restrict: 'EA',
            scope: {
                currentUser: '=user',
                userCardId: '=pid'
            },
            templateUrl:'angular_components/userSettings/common/userSettingsModals/userCardModal.html',
            link: function (scope) {
                scope.avatarUrl = "../images/default-avatar.png";
                // get user customized avatarUrl
                (function () {
                    _AjaxRequest.get('/api/privileges/')
                        .then(
                            function successCallback(result) {
                                // $scope.avatarUrl = result.data;
                            },
                            function errorCallback(error) {
                                console.error(error);
                            }
                        )
                }());

                scope.getDisplayName = function () {
                    var userData = scope.currentUser;
                    if (userData.name.preferredName) {
                        return userData.name.preferredName;
                    } else if (userData.name.firstName && userData.name.lastName) {
                        return userData.name.firstName + ' ' + userData.name.lastName;
                    } else {
                        return  userData.utorid;
                    }
                };

            }
        };
    }

    editProfile.$inject = ['_AjaxRequest', '_Authentication']; // dependency injection
    function editProfile(_AjaxRequest, _Authentication) {
        return {
            restrict: 'EA',
            scope: {
                getCurrentUser: '&user',
                editProfileId: '=pid'
            },
            templateUrl:'angular_components/userSettings/common/userSettingsModals/editUserProfile.html',
            link: function ($scope) {
                // edit profile form
                $scope.privileges = [];
                (function () {
                    _AjaxRequest.get('/api/privileges/')
                        .then(
                            function successCallback(result) {
                                $scope.privileges = result.data;
                            },
                            function errorCallback(error) {
                                console.error(error);
                            }
                        )
                }());

                $scope.editUserInfo = $scope.getCurrentUser();
                $scope.editUserInfo.inputimage =
                    $scope.getCurrentUser().avatarPath? $scope.getCurrentUser().avatarPath: "../images/default-avatar.png";

                // update user information
                $scope.updateUserProfile = function () {
                    var updateBasicInfo = {};
                    if($scope.editUserProfileForm.preferredName.$dirty)
                    {
                        updateBasicInfo["preferredName"] = $scope.editUserInfo.name.preferredName;
                    }
                    if($scope.editUserProfileForm.biography.$dirty)
                    {
                        updateBasicInfo["biography"] = $scope.editUserInfo.biography;
                    }
                    if(!angular.equals({}, updateBasicInfo))
                    {
                        _AjaxRequest.patch('/api/users/' + $scope.getCurrentUser()._id + '/update/user-info?' + $.param(updateBasicInfo))
                            .then(
                                function successCallback(result) {
                                    _Authentication.setLoginUser(result.data);
                                    $scope.clearForm();
                                    // todo: profile updated banner
                                },
                                function errorCallback(error) {
                                    console.error(error);
                                }
                            );
                    }

                    var updateMoreInfo = {};
                    if($scope.editUserProfileForm.firstName.$dirty)
                    {
                        updateMoreInfo["firstName"] = $scope.editUserInfo.name.firstName;
                    }
                    if($scope.editUserProfileForm.lastName.$dirty)
                    {
                        updateMoreInfo["lastName"] = $scope.editUserInfo.name.lastName;
                    }
                    if($scope.editUserProfileForm.email.$dirty)
                    {
                        updateMoreInfo["email"] = $scope.editUserInfo.email;
                    }
                    if(!angular.equals({}, updateMoreInfo))
                    {
                        _AjaxRequest.patch('/api/users/' + $scope.getCurrentUser()._id + '/update/user-access?' + $.param(updateMoreInfo))
                            .then(
                                function successCallback(result) {
                                    _Authentication.setLoginUser(result.data);
                                    $scope.clearForm();
                                    // todo: profile updated banner
                                },
                                function errorCallback(error) {
                                    console.error(error);
                                }
                            );
                    }

                };

                $scope.clearForm = function () {
                    angular.element("input[type='file']").val(null);
                    $scope.editUserInfo = $scope.getCurrentUser();
                    $scope.editUserProfileForm.$setPristine();
                    $scope.editUserProfileForm.$setUntouched();
                };
            }
        };
    }


}());
