(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('pointsHistoryController', pointsHistoryController);


    pointsHistoryController.$inject = ['$scope', '$uibModal', '_AjaxRequest']; // dependency injection

    function pointsHistoryController($scope, $uibModal, _AjaxRequest) {

        $scope.items = [];
        $scope.categories = [];

        var getPoints = function () {
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
        };

        (function () {
            getPoints();

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
            else
            {
                getPoints();
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
        $scope.openUserProfileModal = function(userID) {
            _AjaxRequest.get('/api/users?' + $.param({isActive: true, _id: userID}))
                .then(
                    function successCallback(result) {
                        if(result.data)
                        {
                            var modalInstance = $uibModal.open({
                                templateUrl : 'angular_components/userSettings/common/userSettingsModals/userCard/userCardModal.html',
                                controller : 'userCardController',
                                resolve : {
                                    currentUser : function() {
                                        return result.data[0];
                                    }
                                }
                            });
                        }

                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                );
        };

    };

}());
