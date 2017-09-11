(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('leaderBoardRankController', leaderBoardRankController);

    leaderBoardRankController.$inject = ['$scope', '$uibModal', '_AjaxRequest']; // dependency injection

    function leaderBoardRankController($scope, $uibModal, _AjaxRequest) {
        $scope.items = [];

        var getLeaderBoard = function () {
            var uri = '/api/points/sum';
            uri += $scope.selectCategory ? "?" + $.param({pointCategoryID: $scope.selectCategory._id}) : "";
            _AjaxRequest.get(uri)
                .then(
                    // change to get leader board rank endpoint, get userID
                    function successCallback(result) {
                        $scope.items = result.data;

                        // todo: not a good design, need to fix getPointsSum in Point.js and remove this part
                        angular.forEach(result.data, function (item) {
                            _AjaxRequest.get('/api/users?' + $.param({_id: item._id}))
                                .then(
                                    function successCallback(result) {
                                        if(!result.data)
                                        {
                                            // user has been deactived warning, then refresh data
                                            window.alert("User is deactive!");
                                            getLeaderBoard();
                                        }

                                        item.assigneeName = result.data[0].name;
                                    },
                                    function errorCallback(error) {
                                        console.error(error);
                                    }
                                );
                        });

                        return $scope.items;
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                );
        };


        $scope.categories = [];
        (function () {
            getLeaderBoard();

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
            if(newValue !== oldValue)
            {
                getLeaderBoard();
            }
        }, true);



        $scope.sort = {
            sortingOrder : '',
            reverse : false
        };
        $scope.viewby = '10';
        $scope.currentpage = 1;
        $scope.operations = [10, 20, 30];
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
    }

}());