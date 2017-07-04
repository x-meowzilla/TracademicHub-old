(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('loginHistoryController', loginHistoryController);


    loginHistoryController.$inject = ['$scope', '_CheckAuthentication', '_AjaxRequest']; // dependency injection

    function loginHistoryController($scope, _CheckAuthentication, _AjaxRequest) {
        $scope.isAuthenticated = function () {
            return _CheckAuthentication.isAuthenticated();
        };

        $scope.getAccessLevel = function () {
            return _CheckAuthentication.getAccessLevel();
        };

        $scope.items = [{"_id":"59544e374609bf493b5c6023","utorid":"admin1","email":"admin1-test@tracademichub.com","name":{"preferredName":"asdfasd123123f","firstName":"asfva","lastName":"jgdf"},"accessPrivilege":"59544c9117b4fb4805c4d941","biography":"","lastLoginDate":"2017-06-29T17:07:04.837Z"},
            {"_id":"59544e374609bf493b5c6023","utorid":"admin1","email":"admin1-test@tracademichub.com","name":{"preferredName":"asdfasd123123f","firstName":"sv","lastName":"tr"},"accessPrivilege":"59544c9117b4fb4805c4d941","biography":"","lastLoginDate":"2017-06-29T17:07:04.837Z"},
            {"_id":"59544e374609bf493b5c6023","utorid":"admin1","email":"admin1-test@tracademichub.com","name":{"preferredName":"asdfasd123123f","firstName":"sv","lastName":"tr"},"accessPrivilege":"59544c9117b4fb4805c4d941","biography":"","lastLoginDate":"2017-06-29T17:07:04.837Z"},
            {"_id":"59544e374609bf493b5c6023","utorid":"admin1","email":"admin1-test@tracademichub.com","name":{"preferredName":"asdfasd123123f","firstName":"sv","lastName":"tr"},"accessPrivilege":"59544c9117b4fb4805c4d941","biography":"","lastLoginDate":"2017-06-29T17:07:04.837Z"},
            {"_id":"59544e374609bf493b5c6023","utorid":"admin1","email":"admin1-test@tracademichub.com","name":{"preferredName":"asdfasd123123f","firstName":"sv","lastName":"tr"},"accessPrivilege":"59544c9117b4fb4805c4d941","biography":"","lastLoginDate":"2017-06-29T17:07:04.837Z"},
            {"_id":"59544e374609bf493b5c6023","utorid":"admin1","email":"admin1-test@tracademichub.com","name":{"preferredName":"asdfasd123123f","firstName":"sv","lastName":"tr"},"accessPrivilege":"59544c9117b4fb4805c4d941","biography":"","lastLoginDate":"2017-06-29T17:07:04.837Z"},
            {"_id":"59544e374609bf493b5c6023","utorid":"admin1","email":"admin1-test@tracademichub.com","name":{"preferredName":"asdfasd123123f","firstName":"sv","lastName":"tr"},"accessPrivilege":"59544c9117b4fb4805c4d941","biography":"","lastLoginDate":"2017-06-29T17:07:04.837Z"},
            {"_id":"59544e374609bf493b5c6023","utorid":"admin1","email":"admin1-test@tracademichub.com","name":{"preferredName":"asdfasd123123f","firstName":"sv","lastName":"tr"},"accessPrivilege":"59544c9117b4fb4805c4d941","biography":"","lastLoginDate":"2017-06-29T17:07:04.837Z"},
            {"_id":"59544e374609bf493b5c6023","utorid":"admin1","email":"admin1-test@tracademichub.com","name":{"preferredName":"asdfasd123123f","firstName":"sv","lastName":"tr"},"accessPrivilege":"59544c9117b4fb4805c4d941","biography":"","lastLoginDate":"2017-06-29T17:07:04.837Z"},
            {"_id":"59544e374609bf493b5c6023","utorid":"admin1","email":"admin1-test@tracademichub.com","name":{"preferredName":"asdfasd123123f","firstName":"sv","lastName":"tr"},"accessPrivilege":"59544c9117b4fb4805c4d941","biography":"","lastLoginDate":"2017-06-29T17:07:04.837Z"},
            {"_id":"59544e374609bf493b5c6023","utorid":"admin1","email":"admin1-test@tracademichub.com","name":{"preferredName":"asdfasd123123f","firstName":"sv","lastName":"tr"},"accessPrivilege":"59544c9117b4fb4805c4d941","biography":"","lastLoginDate":"2017-06-29T17:07:04.837Z"},
            {"_id":"59544e374609bf493b5c6023","utorid":"admin1","email":"admin1-test@tracademichub.com","name":{"preferredName":"asdfasd123123f","firstName":"qwerasv","lastName":"gsdf"},"accessPrivilege":"59544c9117b4fb4805c4d941","biography":"","lastLoginDate":"2017-06-29T17:07:04.837Z"}];


        (function () {
            _AjaxRequest.get('/api/points/history')
                .then(
                    function successCallback(result) {
                        $scope.pointsHistoryData = result.data;
                    },
                    function errorCallback(error) {
                        console.error(error);
                    }
                )
        }());


        $scope.sort = {
            sortingOrder : '',
            reverse : false
        };
        $scope.viewby = '10';
        $scope.currentpage = 1;
        $scope.operations = [10, 15, 20];
        $scope.searchrecord = '';

    };

}());
