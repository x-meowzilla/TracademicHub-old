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
            }
            else if (vm.clickCount >= 10) {
                isMasterAccessEnabled = true;
                console.log('You have enabled master login access.');
            }
        }

    }

}());
