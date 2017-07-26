(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('userManagementHistoryController', userManagementHistoryController);


    userManagementHistoryController.$inject = ['$scope', '_AjaxRequest']; // dependency injection

    function userManagementHistoryController($scope, _AjaxRequest) {

        $scope.items = [
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva1","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva2","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"TA", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva3","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"delete", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva4","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"modify access privilage", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva5","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"modify user info", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva6","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"gain points", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva7","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"gain points", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva8","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"gain points", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva9","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"TA", "operationType":"assign points", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva19","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"TA", "operationType":"assign points", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva18","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"TA", "operationType":"assign points", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva0","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"TA", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva11","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"TA", "operationType":"delete", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva12","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva13","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva14","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva15","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva16","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"},
            {"name":{"preferredName":"asdfasd123123f","firstName":"asfva17","lastName":"jgdf"}, "email":"abc@gmail.com", "accessPrivilege":"Student", "operationType":"add", "operationTime":"2017-06-29T17:07:04.837Z"}
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
