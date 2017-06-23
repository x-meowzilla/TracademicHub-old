(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .factory('_UTORidAuthentication', utoridAuthentication)
        .factory('_CheckAuthentication', checkAuthentication)
        .factory('_AjaxRequest', ajaxRequest)
        .directive('thDatatables', thDatatables);

    function utoridAuthentication() {
        return {
            UTORidLogin: function () {
                // we need to use $http service to call our api
                window.location = "/Shibboleth.sso/Login";
            }
        };
    }

    function checkAuthentication() {
        return {

            _isAuthenticated: false,
            _accessLevel: -1,
            _displayName: "",

            isAuthenticated: function () {
                return this._isAuthenticated;
            },
            getAccessLevel: function () {
                return this._accessLevel;
            },
            getDisplayName: function () {
                return this._displayName;
            },
            logout: function () {
                this._isAuthenticated = false;
                this._accessLevel = -1;
                this._displayName = "";
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

    function thDatatables() {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                // "sAjaxSource": "ajax/pages.php",
                //            'ajax': '/lab/articles/jquery-datatables-pagination-without-ellipses/arrays-many.txt',
                angular.element(elem).DataTable(scope.$eval(attrs.thDatatables));
            }
        }
    }

}());
