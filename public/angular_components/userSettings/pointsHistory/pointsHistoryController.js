(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('pointsHistoryController', pointsHistoryController);


    pointsHistoryController.$inject = ['$scope', '_AjaxRequest']; // dependency injection

    function pointsHistoryController($scope, _AjaxRequest) {

        $scope.items = [];
        $scope.categories = [];
        (function () {
            _AjaxRequest.get('/api/points/')
                .then(
                    // change to get leader board rank endpoint, get userID
                    function successCallback(result) {
                        $scope.items = result.data;
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                );

            _AjaxRequest.get('/api/points-category/')
                .then(
                    function successCallback(result) {
                        $scope.categories = result.data;
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                );
        }());


        $scope.$watch('selectCategory', function(newValue, oldValue) {
            if(!angular.isUndefined(newValue) && newValue !== null)
            {
                _AjaxRequest.get('/api/points?' + $.param({categoryID: newValue._id}))
                    .then(
                        function successCallback(result) {
                            $scope.items = result.data;
                        },
                        function errorCallback(error) {
                            console.error(error);
                        }
                    );
            }
        }, true);


        $scope.sort = {
            sortingOrder : '',
            reverse : false
        };
        $scope.viewby = '10';
        $scope.currentpage = 1;
        $scope.operations = [10, 15, 20];
        $scope.searchrecord = '';


        // user card modal
        $scope.openUserProfileModal = function(user) {
            console.log('hi');
            // var modalInstance = $uibModal.open({
            //     templateUrl : 'angular_components/userSettings/common/userSettingsModals/userCard/userCardModal.html',
            //     controller : 'userCardController',
            //     resolve : {
            //         currentUser : function() {
            //             return currentUser;
            //         }
            //     }
            // })
        };

    };

}());
