(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .factory('_Authentication', authentication)
        .factory('_UTORidAuthentication', utoridAuthentication)
        .factory('_AjaxRequest', ajaxRequest);

    function authentication() {
        return {
            isAuthenticated: function () {
                return window.localStorage.getItem('currentUser') !== null;
            },
            
            setCurrentUser: function (user) {
                window.localStorage.setItem('currentUser', user);
                return user;
            },
            
            getCurrentUser: function () {
                return JSON.parse(window.localStorage.getItem('currentUser'));
            },
            
            setDisplayName: function (name) {
                window.localStorage.setItem('displayName', name);
                return name;
            },

            getDisplayName: function () {
               return  window.localStorage.getItem('displayName');
            }
        }
    }

    function utoridAuthentication() {
        return {
            UTORidLogin: function () {
                // we need to use $http service to call our api
                window.location = "/Shibboleth.sso/Login";
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
