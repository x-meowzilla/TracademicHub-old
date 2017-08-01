(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('userManagementController', userManagementController)
        .directive('addUserModal', addUserModal);

    userManagementController.$inject = ['$scope', '$location', '_Authentication', '_AjaxRequest', '_AssignPoints']; // dependency injection

    function userManagementController($scope, $location, _Authentication, _AjaxRequest, _AssignPoints) {

        $scope.currentUser = _Authentication.getCurrentUser();
        $scope.defaultAvatar = "../images/default-avatar.png";


        $scope.items = [];
        $scope.getUsers = function (displayType) {
            _AjaxRequest.get('/api/users')
                .then(
                    function successCallback(result) {
                        $scope.items = result.data.filter(function (item) {
                            var res = item._id !== _Authentication.getCurrentUser()._id;
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
                                return res && item.lastLoginDate === nul;
                            }
                        });
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                )
        };

        (function () {
            // $scope.getUsers('active');
            _AjaxRequest.get('/api/users')
                .then(
                    function successCallback(result) {
                        $scope.items = result.data;
                        // var displayType = 'other';
                        // $scope.items = result.data.filter(function (item) {
                        //     var res = item._id !== _Authentication.getCurrentUser()._id;
                        //     if(displayType === 'all')
                        //     {
                        //         return res && item.isActive;
                        //     }
                        //     else if(displayType === 'active')
                        //     {
                        //         return res && item.isActive;
                        //     }
                        //     else if(displayType === 'inactive')
                        //     {
                        //         return res && !item.isActive;
                        //     }
                        //     else
                        //     {
                        //         return res && item.lastLoginDate !== nul;
                        //     }
                        // });
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                )
        }());


        $scope.sort = {
            sortingOrder : '',
            reverse : false
        };
        $scope.viewby = '10';
        $scope.currentpage = 1;
        $scope.operations = [10, 20, 30];
        $scope.searchrecord = '';

        // check mutiple rows in table view
        $scope.checkedNumber = 0;
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
                if(checked != item.selected)
                {
                    // selected from true to false: -1, selected from false to true: +1
                    $scope.checkedNumber = $scope.checkedNumber + (!item.selected ? 1 : -1);
                }
                item.selected = checked;
            });
        };

        $scope.checkRow = function (selectState, pagedItems, currentpage) {
            $scope.checkedNumber = $scope.checkedNumber + (selectState ? 1 : -1);

            if($scope.checkedNumber === pagedItems.length)
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
            scope: {},
            templateUrl:'angular_components/userSettings/common/userSettingsModals/addUserModal.html',
            link: function ($scope) {
                $scope.editUserInfoOrigin = {utorid: '', password: '', repassword: '', firstName: '', lastName: '', preferredName: '', email: '', accessPrivilege: ''};
                $scope.editUserInfo = angular.copy($scope.editUserInfoOrigin);

                $scope.utoridExist = false;

                $scope.createAdmin = function () {
                    _AjaxRequest.put('/api/local-register/', $scope.editUserInfo)
                        .then(
                            function successCallback(result) {
                                $scope.clearForm();
                                angular.element("#addUserModal").modal('hide');
                            },
                            function errorCallback(error) {
                                console.error(error);
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
                                $location.path( "/userManagement" );
                                $scope.clearForm();
                                // TODO: show save successfully banner
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
                };
            }
        };
    }

}());
