(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('navbarController', navbarController);

    navbarController.$inject = ['$scope', '_UTORidAuthentication', '_CheckAuthentication', '_AjaxRequest']; // dependency injection
    function navbarController($scope, _UTORidAuthentication, _CheckAuthentication, _AjaxRequest) {

        var isMasterAccessEnabled = false;

        $scope.UTORidLogin = function () {
            return _UTORidAuthentication.UTORidLogin();
        };

        $scope.isAuthenticated = function () {
            return _CheckAuthentication.isAuthenticated();
        };

        $scope.getDisplayName = function () {
            return _CheckAuthentication.getDisplayName();
        };

        $scope.getAccessLevel = function () {
            return _CheckAuthentication.getAccessLevel();
        };

        $scope.isMasterLoginEnabled = function () {
            return isMasterAccessEnabled;
        };

        $scope.enableMasterAccess = function () {
            var vm = this;
            if (!vm.clickCount) vm.clickCount = 1;
            else vm.clickCount++;

            if (vm.clickCount >= 7 && vm.clickCount < 10) {
                console.log('You are ' + (10 - vm.clickCount) + ' clicks from enabling master login access.');
                // TODO - show info banner
            }
            else if (vm.clickCount >= 10) {
                isMasterAccessEnabled = true;
                console.log('You have enabled master login access.');
                // TODO - show info banner
            }
        };

        $scope.masterLogin = function () {
            var formData = {
                utorid: $scope.masterUsername,
                password: $scope.masterPassword
            };
            //testtest
            console.log("he" + $scope.masterUsername);
            _AjaxRequest.post('/api/local/users/login', formData, true).then(
                function successCallback(result) {
                    console.log(result);

                    var userData = result.data;
                    _CheckAuthentication._isAuthenticated = true;
                    _CheckAuthentication._displayName = getDisplayName(userData);
                    _CheckAuthentication._accessLevel = userData.accessLevel;

                    // TODO - show login successful banner

                    function getDisplayName(userData) {
                        if (userData.name.preferredName) {
                            return userData.name.preferredName;
                        } else if (userData.name.firstName && userData.name.lastName) {
                            return userData.name.firstName + ' ' + userData.name.lastName;
                        } else {
                            return userData.utorid;
                        }
                    }
                },
                function errorCallback(error) {
                    console.log(error.data);
                    // TODO - show login failed banner
                }
            )
        };

        $scope.logout = function () {
            _AjaxRequest.delete('/api/users/logout').then(
                function successCallback(result) {
                    console.log(result);
                },
                function errorCallback(error) {
                    console.log(error);
                }
            )
        }

    }

}());
