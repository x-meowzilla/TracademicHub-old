(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('homepageController', homepageController);

    homepageController.$inject = ['$scope', '_UTORidAuthentication'];
    function homepageController($scope, _UTORidAuthentication) {

        $scope.UTORidLogin = function () {
            return _UTORidAuthentication.UTORidLogin();
        };
    }

}());
