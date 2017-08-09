(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('userManagementController', userManagementController)
        .directive('addUserModal', addUserModal);

    userManagementController.$inject = ['$scope', '$location', '_Authentication', '_AjaxRequest', '_AssignPoints', 'AUTH_EVENTS']; // dependency injection

    function userManagementController($scope, $location, _Authentication, _AjaxRequest, _AssignPoints, AUTH_EVENTS) {
        // users data settings
        $scope.currentUser = _Authentication.getLoginUser();

        $scope.users = [];
        var getUsers = function (displayType) {
            _AjaxRequest.get('/api/users')
                .then(
                    function successCallback(result) {
                        $scope.users = result.data.filter(function (item) {
                            var res = item._id !== _Authentication.getLoginUser()._id;
                            if(displayType === 'all')
                            {
                                return res && item.isActive;
                            }
                            else if(displayType === 'active')
                            {
                                return res && item.isActive;
                            }
                            else if(displayType === 'inactive')
                            {
                                return res && !item.isActive;
                            }
                            else
                            {
                                return res && item.lastLoginDate;
                            }
                        });
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                );
        };
        $scope.getUsers = function (displayType) {
            getUsers(displayType);
        };

        (function () {
            getUsers('active');
        }());

        $scope.defaultAvatar = "../images/default-avatar.png";



        // user tables settings
        $scope.sort = {
            sortingOrder : '',
            reverse : false
        };
        $scope.viewby = '10';
        $scope.currentpage = 1;
        $scope.operations = [10, 20, 30];
        $scope.searchrecord = '';

        // check mutiple rows in table view
        $scope.checkedItems = [];
        $scope.checkedPages = [];

        $scope.checkAll = function (pagedItems, currentpage) {
            var idx = $scope.checkedPages.indexOf(currentpage);

            if(idx === -1)
            {
                // add current page to checked pages list
                $scope.checkedPages.push(currentpage);
            }
            else
            {
                // remove current page from checked pages list
                $scope.checkedPages.splice(idx, 1);
            }

            angular.forEach(pagedItems, function (item) {
                var checked = $scope.checkedPages.indexOf(currentpage) !== -1;
                var index = $scope.checkedItems.indexOf(item);
                if(checked && index < 0)
                {
                    // add item if selected and not in the array
                    $scope.checkedItems.push(item);
                }
                else if(!checked && index > -1)
                {
                    // delete item if not selected and in the array
                    $scope.checkedItems.splice(index, 1);
                }

                item.selected = checked;
            });
        };

        $scope.checkRow = function (item, pagedItems, currentpage) {
            var index = $scope.checkedItems.indexOf(item);
            if(item.selected && index < 0)
            {
                // add item if selected and not in the array
                $scope.checkedItems.push(item);
            }
            else if(!item.selected && index > -1)
            {
                // delete item if not selected and in the array
                $scope.checkedItems.splice(index, 1);
            }

            if($scope.checkedItems.length === pagedItems.length)
            {
                $scope.selectedAll.checked = true;
                $scope.checkedPages.push(currentpage);
            }
            else if($scope.selectedAll.checked)
            {
                $scope.selectedAll.checked = false;
                var idx = $scope.checkedPages.indexOf(currentpage);
                $scope.checkedPages.splice(idx, 1);
            }
        };

        $scope.selectedAll = {checked: true};
        $scope.$watch('currentpage', function(newValue, oldValue) {
            $scope.selectedAll.checked=$scope.checkedPages.indexOf(newValue) !== -1;
        }, true);



        // user operations settings
        $scope.utoridExist = false;

        // delete/deactive user
        $scope.deleteUser = function (user) {
            _AjaxRequest.patch('/api/users/' + user._id + '/update/user-access?' + $.param({isActive: false}))
                .then(
                    function successCallback(result) {
                        $scope.items = $scope.items.filter(function (item) {
                            return item._id !== result.data._id;
                        });
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                )
        };
        
        // delete all selected user
        $scope.deleteSelectedUsers = function (users) {
            angular.forEach(users, function (user) {
                if(user._id !== $scope.currentUser._id)
                {
                    $scope.deleteUser(user);
                }
            });
        };

        // edit privileges of (mutiple) users
        $scope.courses = [];
        (function () {
            _AjaxRequest.get('/api/courses/')
                .then(
                    function successCallback(result) {
                        $scope.courses = result.data;
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                )
        }());
        
        $scope.assignPrivilege = function () {
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
        };

        // give points to selected user(s)
        $scope.givePoints = function (users) {
            $location.path( "/pointManagement" );
            _AssignPoints.setAssignees(users);
        };

    }

    addUserModal.$inject = ['$location', '_AjaxRequest'];
    function addUserModal($location, _AjaxRequest) {
        return {
            restrict: 'EA',
            scope: {
                users: '='
            },
            templateUrl:'angular_components/userSettings/common/userSettingsModals/addUserModal.html',
            link: function ($scope, element) {
                $scope.utoridExist = false;
                $scope.$watch('editUserInfo.utorid', function(newValue, oldValue) {
                    $scope.utoridExist = false;
                }, true);

                $scope.editUserInfoOrigin = {utorid: '', password: '', repassword: '', firstName: '', lastName: '', preferredName: '', email: '', accessPrivilege: ''};
                $scope.editUserInfo = angular.copy($scope.editUserInfoOrigin);

                $scope.createAdmin = function () {
                    _AjaxRequest.put('/api/local-register/', $scope.editUserInfo)
                        .then(
                            function successCallback(result) {
                                $scope.clearForm();
                                angular.element("#addUserModal").modal('hide');
                                $scope.users.push(result.data);
                            },
                            function errorCallback(error) {
                                if(error.status === 409)
                                {
                                    $scope.utoridExist = true;
                                }
                            }
                        );
                };

                $scope.importCSVFile = function () {
                    _AjaxRequest.post('/api/users/', $scope.csvfile)
                        .then(
                            function successCallback(result) {
                                $scope.clearForm();
                                angular.element("#addUserModal").modal('hide');
                                $scope.users.push(result.data);
                            },
                            function errorCallback(error) {
                                // TODO: show save failed banner
                                console.error(error);
                            }
                        );
                };

                $scope.clearForm = function () {
                    angular.element("input[type='file']").val(null);
                    $scope.editUserInfo = angular.copy($scope.editUserInfoOrigin);
                    $scope.addUserForm.$setPristine();
                    $scope.addUserForm.$setUntouched();
                };
            }
        };
    }

}());
