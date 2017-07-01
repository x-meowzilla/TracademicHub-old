(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('userManagementController', userManagementController);

    userManagementController.$inject = ['$scope', '_CheckAuthentication', '_AjaxRequest']; // dependency injection

    function userManagementController($scope, _CheckAuthentication, _AjaxRequest) {
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
            {"_id":"59544e374609bf493b5c6023","utorid":"admin1","email":"admin1-test@tracademichub.com","name":{"preferredName":"asdfasd123123f","firstName":"sv","lastName":"tr"},"accessPrivilege":"59544c9117b4fb4805c4d941","biography":"","lastLoginDate":"2017-06-29T17:07:04.837Z"},
            {"_id":"59544e374609bf493b5c6023","utorid":"admin1","email":"admin1-test@tracademichub.com","name":{"preferredName":"asdfasd123123f","firstName":"qwerasv","lastName":"gsdf"},"accessPrivilege":"59544c9117b4fb4805c4d941","biography":"","lastLoginDate":"2017-06-29T17:07:04.837Z"}];

        (function () {
            _AjaxRequest.get('/api/users/')
                .then(
                    function successCallback(result) {
                        $scope.items = result.data;
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
        $scope.operations = [10, 20, 30];
        $scope.searchrecord = '';

        // check mutiple rows in table view
        $scope.checkedNumber = 0;
        $scope.checkedPages = [];

        $scope.checkAll = function (pagedItems, currentpage) {
            var idx = $scope.checkedPages.indexOf(currentpage);

            if(idx === -1)
            {
                // add current page to checked pages list
                $scope.checkedPages.push(currentpage);
            }
            else
            {
                // remove current page from checked pages list
                $scope.checkedPages.splice(idx, 1);
            }

            angular.forEach(pagedItems, function (item) {
                var checked = $scope.checkedPages.indexOf(currentpage) !== -1;
                if(checked != item.selected)
                {
                    // selected from true to false: -1, selected from false to true: +1
                    $scope.checkedNumber = $scope.checkedNumber + (!item.selected ? 1 : -1);
                }
                item.selected = checked;
            });
        };

        $scope.checkRow = function (selectState, pagedItems, currentpage) {
            $scope.checkedNumber = $scope.checkedNumber + (selectState ? 1 : -1);

            if($scope.checkedNumber === pagedItems.length)
            {
                $scope.selectedAll.checked = true;
                $scope.checkedPages.push(currentpage);
            }
            else if($scope.selectedAll.checked)
            {
                $scope.selectedAll.checked = false;
                var idx = $scope.checkedPages.indexOf(currentpage);
                $scope.checkedPages.splice(idx, 1);
            }
        };

        $scope.selectedAll = {checked: true};
        $scope.$watch('currentpage', function(newValue, oldValue) {
            $scope.selectedAll.checked=$scope.checkedPages.indexOf(newValue) !== -1;
        }, true);
    }

}());
