(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('navbarController', navbarController);

    navbarController.$inject = ['$scope', '_Authentication', '_UTORidAuthentication']; // dependency injection
    function navbarController($scope, _Authentication, _UTORidAuthentication) {

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
            var loginData = {
                utorid: $scope.masterUsername,
                password: $scope.masterPassword
            };

            _Authentication.login(loginData);
        };

        $scope.logout = function () {
            _Authentication.logout();
        };

    }

}());
