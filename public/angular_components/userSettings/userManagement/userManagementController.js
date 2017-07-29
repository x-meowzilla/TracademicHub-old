(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('userManagementController', userManagementController);

    userManagementController.$inject = ['$scope', '$location', '_Authentication', '_AjaxRequest', '_ViewProfile', '_AssignPoints']; // dependency injection

    function userManagementController($scope, $location, _Authentication, _AjaxRequest, _ViewProfile, _AssignPoints) {

        $scope.currentUser = _ViewProfile.getUser();
        $scope.defaultAvatar = "../images/default-avatar.png";


        $scope.items = [];

        (function () {
            _AjaxRequest.get('/api/users?' + $.param({isActive: true}))
                .then(
                    function successCallback(result) {
                        $scope.items = result.data.filter(function (item) {
                            return item._id !== _Authentication.getCurrentUser()._id;
                        });
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


        // edit user profile
        $scope.viewUserProfile = function (user) {
            $location.path( "/profile" );
            // pass userId of selected user.
            _ViewProfile.setUser(user);

        };

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


        // give points to selected user
        $scope.getPoints = function (users) {
            $location.path( "/pointManagement" );
            _AssignPoints.setAssignees(users);
        };

    }

}());
