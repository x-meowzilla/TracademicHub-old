(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('userManagementController', userManagementController);

    userManagementController.$inject = ['$scope', '$location', '_Authentication', 'PRIVILEGE', '_AjaxRequest', '_AssignPoints']; // dependency injection

    function userManagementController($scope, $location, _Authentication, PRIVILEGE, _AjaxRequest, _AssignPoints) {
        $scope.authorizedPrivilege = PRIVILEGE;
        $scope.isAuthorized = function (value) {
            // todo: hard-coded for now, need to udpate when server side access privilege checking apis finished.
            return _Authentication.isAuthorized(value);
        };

        // users data settings
        $scope.currentUser = _Authentication.getLoginUser();
        $scope.defaultAvatar = "../images/default-avatar.png";

        $scope.users = [];
        $scope.displayTypes = ['all', 'active', 'inactive', 'checkedin'];
        $scope.displayUser = {displayType: $scope.displayTypes[1], displayCourse: {}, displayPrivilege: {}};

        var getUsers = function () {
            // isActive query not working now, upload csv data cannot save this field to db, need to be fixed in the future.
            _AjaxRequest.get('/api/users')
                .then(
                    function successCallback(result) {
                        $scope.users = result.data.filter(function (item) {
                            // filter by user type
                            var res = item._id !== $scope.currentUser._id && !item.isLocalUser;

                            if($scope.displayUser.displayType === 'active')
                            {
                                res = res && item.isActive;

                                // filter by course
                                if(!angular.isUndefined($scope.displayUser.displayCourse)
                                    && !angular.equals({}, $scope.displayUser.displayCourse))
                                {
                                    var courseList = [];
                                    angular.forEach(item.courseEnrolled, function (ce) {
                                        courseList.push(ce.course._id);
                                    });

                                    res = res && courseList.indexOf($scope.displayUser.displayCourse._id) > -1;
                                }

                                // filter by user privilege
                                if(!angular.isUndefined($scope.displayUser.displayPrivilege)
                                    && !angular.equals({}, $scope.displayUser.displayPrivilege))
                                {
                                    var pList = [];
                                    angular.forEach(item.courseEnrolled, function (ce) {
                                        pList.push(ce.privilege._id);
                                    });

                                    res = res && pList.indexOf($scope.displayUser.displayPrivilege._id) > -1;
                                }
                            }
                            else if($scope.displayUser.displayType === 'inactive')
                            {
                                res = res && !item.isActive;
                            }
                            else if($scope.displayUser.displayType === 'checkedin')
                            {
                                res = res && item.lastLoginDate;
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
            if($scope.currentUser.isLocalUser)
            {
                // local admin can get view all courses
                _AjaxRequest.get('/api/courses/')
                    .then(
                        function successCallback(result) {
                            $scope.courses = result.data;
                        },
                        function errorCallback(error) {
                            console.error(error);
                        }
                    )
            }
            else
            {
                // get the courses that current user has access to.
                var courseIds = [];
                angular.forEach($scope.currentUser.courseEnrolled, function (item) {
                    var courseId = item.course._id;
                    if(courseIds.indexOf(courseId) < 0)
                    {
                        _AjaxRequest.get('/api/courses?' + $.param({_id: courseId}))
                            .then(
                                function successCallback(result) {
                                    $scope.courses.push(result.data[0]);
                                    courseIds.push(result.data[0]._id);
                                },
                                function errorCallback(error) {
                                    console.error(error);
                                }
                            );
                    }
                });
            }

        }());

        $scope.assignPrivilege = function (users, privilege) {
            angular.forEach(users, function (user) {
                _AjaxRequest.patch('/api/users/' + user._id + '/update/user-access?' + $.param({accessPrivilege: privilege._id}))
                    .then(
                        function successCallback(result) {
                            // todo: profile updated banner
                        },
                        function errorCallback(error) {
                            console.error(error);
                        }
                    );

                getUsers();
                clearSelected();
            });
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



        $scope.importFile = {};
        $scope.enableImportBtn = false;
        $scope.createUserForm = {};
        $scope.$watchCollection('importFile', function(newNames, oldNames) {
            var csvfile = newNames.csvfile;
            var course = newNames.course;
            if(!angular.isUndefined(csvfile) && csvfile !== null && !angular.isUndefined(course) && course)
            {
                $scope.enableImportBtn = true;
            }
            else
            {
                $scope.enableImportBtn = false;
            }
        });
        $scope.importCSVFile = function () {
            var fd = new FormData();
            fd.append('csvfile', $scope.importFile.csvfile);
            fd.append('course', $scope.importFile.course._id);
            _AjaxRequest.postFormData('/api/users/', fd)
                .then(
                    function successCallback(result) {
                        $scope.clearForm();
                        $scope.createUserForm.invalidCSVFormat = false;
                        angular.element("#addUserModal").modal('hide');
                        getUsers();
                    },
                    function errorCallback(error) {
                        // TODO: show save failed banner
                        console.error(error);
                        if(error.status === 400)
                        {
                            $scope.createUserForm.invalidCSVFormat = true;
                        }
                    }
                );
        };

        $scope.clearForm = function () {
            angular.element("input[type='file']").val(null);
            $scope.importFile.course = '';
            $scope.enableImportBtn = false;
        };

    }

}());
