(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('userManagementHistoryController', userManagementHistoryController);


    userManagementHistoryController.$inject = ['$scope', '_CheckAuthentication', '_AjaxRequest']; // dependency injection

    function userManagementHistoryController($scope, _CheckAuthentication, _AjaxRequest) {
        $scope.isAuthenticated = function () {
            return _CheckAuthentication.isAuthenticated();
        };

        $scope.getAccessLevel = function () {
            return _CheckAuthentication.getAccessLevel();
        };

        $scope.items = [
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"}
        ];

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
