(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('manageProductsController', manageProductsController)
        .directive('switchButton', switchButton);

    manageProductsController.$inject = ['$scope', '_CheckAuthentication', '_AjaxRequest']; // dependency injection

    function manageProductsController($scope, _CheckAuthentication) {
        $scope.isAuthenticated = function () {
            return _CheckAuthentication.isAuthenticated();
        };

        $scope.getAccessLevel = function () {
            return _CheckAuthentication.getAccessLevel();
        };

    }

    function switchButton(){
        return {
            restrict: 'A',
            transclude: true,
            scope: {
                btnid: '@'
            },
            template :
            '<ng-transclude></ng-transclude>' +
            '<div class="pull-right">' +
            '<div class="switchbtn">' +
            '<input type="checkbox" name="switchbtn" class="switchbtn-checkbox" ng-init="enabled=true" ng-model="enabled" id={{btnid}} checked>' +
            '<label class="switchbtn-label" for="{{btnid}}">' +
            '<span class="switchbtn-inner"></span>' +
            '<span class="switchbtn-switch"></span>' +
            '</label>' +
            '</div>' +
            '</div>',
            link: function(scope) {
                scope.$watch('enabled', function(newValue, oldValue) {
                    console.log("execute enable and disable products functions here");

                }, true);
            }
        }
    }

}());
