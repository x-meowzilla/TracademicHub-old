(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('sideBarController', sideBarController);


    sideBarController.$inject = ['$scope', '_Authentication', 'PRIVILEGE']; // dependency injection

    function sideBarController($scope, _Authentication, PRIVILEGE) {
        $scope.isAuthorized = function (idx) {
            // todo: hard-coded for now, need to udpate when server side access privilege checking apis finished.
            return _Authentication.isAuthorized(PRIVILEGE[idx].value);
        };
    };

}());
