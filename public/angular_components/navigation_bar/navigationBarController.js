(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('navbarController', navbarController);

    navbarController.$inject = ['$scope', '_Authentication', '_UTORidAuthentication', '_AjaxRequest']; // dependency injection
    function navbarController($scope, _Authentication, _UTORidAuthentication, _AjaxRequest) {

        var isMasterAccessEnabled = false;

        $scope.UTORidLogin = function () {
            return _UTORidAuthentication.UTORidLogin();
        };

        $scope.isAuthenticated = function () {
            return _Authentication.isAuthenticated();
        };

        $scope.displayName = function (){
            return _Authentication.getDisplayName();
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
            _AjaxRequest.post('/api/local-login', formData, true).then(
                function successCallback(result) {

                    var userData = result.data;
                    _Authentication.setCurrentUser(JSON.stringify(userData));

                    function getDisplayName(userData) {
                        if (userData.name.preferredName) {
                            return userData.name.preferredName;
                        } else if (userData.name.firstName && userData.name.lastName) {
                            return userData.name.firstName + ' ' + userData.name.lastName;
                        } else {
                            return userData.utorid;
                        }
                    }
                    _Authentication.setDisplayName(getDisplayName(userData));

                    // TODO - show login successful banner
                },
                function errorCallback(error) {
                    console.log(error.data);
                    // TODO - show login failed banner
                }
            )
        };

        $scope.logout = function () {
            _AjaxRequest.get('/api/logout').then(
                function successCallback(result) {
                    window.localStorage.clear();
                    console.log(result);
                },
                function errorCallback(error) {
                    console.log(error);
                }
            )
        }

    }

}());
