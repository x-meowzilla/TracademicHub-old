(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .factory('_CheckAuthentication', checkAuthentication);

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

}());
