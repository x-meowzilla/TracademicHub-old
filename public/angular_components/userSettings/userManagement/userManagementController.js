(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('userManagementController', userManagementController);

    userManagementController.$inject = ['$scope', '$location', '_Authentication', '_AjaxRequest', '_AssignPoints', 'AUTH_EVENTS']; // dependency injection

    function userManagementController($scope, $location, _Authentication, _AjaxRequest, _AssignPoints, AUTH_EVENTS) {
        // users data settings
        $scope.currentUser = _Authentication.getLoginUser();
        $scope.defaultAvatar = "../images/default-avatar.png";

        $scope.users = [];
        $scope.displayTypes = ['all', 'active', 'inactive', 'checkedin'];
        $scope.displayUser = {displayType: $scope.displayTypes[1], displayCourse: {}, displayPrivilege: {}};

        var getUsers = function () {
            var userParam = {};

            if($scope.displayUser.displayType === 'active')
            {
                userParam['isActive'] = true;
            }
            else if($scope.displayUser.displayType === 'inactive')
            {
                userParam['isActive'] = false;
            }

            _AjaxRequest.get('/api/users?' + $.param(userParam))
                .then(
                    function successCallback(result) {
                        $scope.users = result.data.filter(function (item) {
                            var res = item._id !== $scope.currentUser._id && !item.isLocalUser;

                            if($scope.displayUser.displayType === 'checkedin')
                            {
                                return res && item.lastLoginDate;
                            }

                            return res;
                        });
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                );
        };

        $scope.$watch('displayUser', function(newValue, oldValue) {
            getUsers();
            clearSelected();
        }, true);

        (function () {
            getUsers();
        }());



        // user tables settings
        $scope.sort = {
            sortingOrder : '',
            reverse : false
        };
        $scope.viewby = '10';
        $scope.currentpage = 1;
        $scope.operations = [10, 20, 30];
        $scope.searchrecord = '';

        $scope.getColspan = function () {
            if($scope.displayUser.displayType === 'all')
            {
                return 6;
            }
            else if($scope.displayUser.displayType === 'active')
            {
                return 10;
            }
            else if($scope.displayUser.displayType === 'inactive')
            {
                return 8;
            }
            else
            {
                return 9;
            }
        };

        // check mutiple rows in table view
        $scope.checkedItems = [];
        $scope.checkedPages = [];

        $scope.getPagedItems = function (filteredData) {
            $scope.pagedItems = filteredData;
            return filteredData;
        };
        
        var checkListHasItem = function (items, itemID) {
            for (var i = 0; i < items.length; i ++){
                if(items[i]._id === itemID)
                {
                    return i;
                }
            }
            return -1;
        };

        $scope.checkAll = function (currentpage) {
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

            angular.forEach($scope.pagedItems, function (item) {
                var checked = $scope.checkedPages.indexOf(currentpage) !== -1;
                var index = checkListHasItem($scope.checkedItems, item._id);

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

        $scope.checkRow = function (item, currentpage) {
            var index = checkListHasItem($scope.checkedItems, item._id);
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

            if($scope.checkedItems.length === $scope.pagedItems.length)
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
        
        var clearSelected = function () {
            $scope.checkedPages = [];
            $scope.checkedItems = [];
            $scope.selectedAll.checked = false;
            angular.forEach($scope.pagedItems, function (item) {
                item.selected = false;
            });
        };

        $scope.selectedAll = {checked: true};
        $scope.$watch('currentpage', function(newValue, oldValue) {
            $scope.selectedAll.checked=$scope.checkedPages.indexOf(newValue) !== -1;
        }, true);

        $scope.$watch('pagedItems', function(newValue, oldValue) {
            if(!angular.isUndefined(newValue) && !angular.isUndefined(oldValue))
            {
                var changed = false;
                angular.forEach(oldValue, function (item) {
                    changed = checkListHasItem(newValue, item._id) < -1;
                });

                if(changed || newValue.length !== oldValue.length)
                {
                    clearSelected();
                }
            }

        }, true);



        // user operations settings
        $scope.utoridExist = false;

        // delete/deactive user
        $scope.deleteUser = function (user) {
            _AjaxRequest.patch('/api/users/' + user._id + '/update/user-access?' + $.param({isActive: false}))
                .then(
                    function successCallback(result) {
                        $scope.users = $scope.users.filter(function (item) {
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

        // active users
        $scope.activeUser = function (user) {
            _AjaxRequest.patch('/api/users/' + user._id + '/update/user-access?' + $.param({isActive: true}))
                .then(
                    function successCallback(result) {
                        $scope.users = $scope.users.filter(function (item) {
                            return item._id !== result.data._id;
                        });
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                )
        };

        // active all selected user
        $scope.activeSelectedUsers = function (users) {
            angular.forEach(users, function (user) {
                if(user._id !== $scope.currentUser._id)
                {
                    $scope.activeUser(user);
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



        // add users
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
                        getUsers();
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
            console.log($scope.csvfile);
            _AjaxRequest.post('/api/users/', $scope.csvfile)
                .then(
                    function successCallback(result) {
                        $scope.clearForm();
                        angular.element("#addUserModal").modal('hide');
                        getUsers()
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
        };

    }

}());
