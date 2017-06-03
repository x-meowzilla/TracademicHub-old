(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .factory('_CheckAuthentication', checkAuthentication)
        .factory('_AjaxRequest', ajaxRequest);

    function checkAuthentication() {
        return {
            isAuthenticated: function () {
                return false;
            },
            getAccessLevel: function () {
                if (!this.isAuthenticated()) {
                    return -1;
                } else {
                    return 50;
                }
            }
        };
    }

    ajaxRequest.$inject = ['$http'];
    function ajaxRequest($http) {
        return {
            get: function (apiURL, isJSON) {
                // return Promise? can call .success/.error in other controllers
                return $http.get(apiURL);
                // // or return object
                // $http.get(apiURL)
                //     .then(
                //         function successCallback(response) {
                //             return isJSON ? JSON.parse(response) : response;
                //         },
                //         function errorCallback(error) {
                //             return error
                //         }
                //     )
            },
            post: function (apiURL, reqBody, isJSON) {
                return $http.post(apiURL, reqBody, {headers: isJSON ? {'Content-Type': 'application/json'} : {}});
            },
            put: function (apiURL, reqBody, isJSON) {
                return $http.put(apiURL, reqBody, {headers: isJSON ? {'Content-Type': 'application/json'} : {}});
            },
            delete: function (apiURL) {
                // TODO - method to be discussed
                return $http.delete(apiURL);
            }
        };
    }

}());
