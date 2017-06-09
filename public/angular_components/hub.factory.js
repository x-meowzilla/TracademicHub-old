(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .factory('_CheckAuthentication', checkAuthentication)
        .factory('_AjaxRequest', ajaxRequest);

    function checkAuthentication() {
        return {
            UTORidLogin: function () {
                // we need to use $http service to call our api
                window.location = "/Shibboleth.sso/Login";
            },
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
            get: function (apiURL) {
                return $http.get(apiURL);
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
