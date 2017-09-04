(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('userCardController', function ($scope, $uibModalInstance, currentUser) {
            $scope.getCurrentUser = function () {
                return currentUser;
            };
            $scope.avatarUrl = $scope.getCurrentUser().avatarPath? $scope.getCurrentUser().avatarPath: "../images/default-avatar.png";

            $scope.getDisplayName = function () {
                var userData = $scope.getCurrentUser();
                if (userData.name.preferredName) {
                    return userData.name.preferredName;
                } else if (userData.name.firstName && userData.name.lastName) {
                    return userData.name.firstName + ' ' + userData.name.lastName;
                } else {
                    return  userData.utorid;
                }
            };

            $scope.closeForm = function () {
                $uibModalInstance.close();
            }
        });

}());
