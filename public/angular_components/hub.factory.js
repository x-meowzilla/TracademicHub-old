(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .constant('AUTH_EVENTS', {
            loginSuccess: 'auth-login-success',
            loginFailed: 'auth-login-failed',
            logoutSuccess: 'auth-logout-success',
            logoutFailed: 'auth-logout-failed',
            notAuthenticated: 'auth-not-authenticated',
            notAuthorized: 'auth-not-authorized'
        })
        .constant('PRIVILEGE', {
            ACCESS_STUDENT: 'Student',
            ACCESS_STUDENT_VALUE: 10,
            ACCESS_TA: 'Teaching Assistant',
            ACCESS_TA_VALUE: 30,
            ACCESS_INSTRUCTOR: 'Instructor',
            ACCESS_INSTRUCTOR_VALUE: 50,
            ACCESS_ADMIN: 'Admin',
            ACCESS_ADMIN_VALUE: 100
        })
        .factory('_AjaxRequest', ajaxRequest)
        .factory('_Authentication', authentication)
        .factory('_UTORidAuthentication', utoridAuthentication)
        .factory('_AuthInterceptor', authInterceptor)
        .directive('loginDialog', loginDialog);


    ajaxRequest.$inject = ['$http'];
    function ajaxRequest($http) {
        return {
            get: function (apiURL) {
                return $http.get(apiURL);
            },
            post: function (apiURL, reqBody, isJSON) {
                return $http.post(apiURL, reqBody, {headers: isJSON ? {'Content-Type': 'application/json'} : {}});
            },
            postFormData: function (apiURL, reqBody) {
                return $http.post(apiURL, reqBody, {transformRequest: angular.identity, headers: {'Content-Type': undefined}});
            },
            put: function (apiURL, reqBody, isJSON) {
                return $http.put(apiURL, reqBody, {headers: isJSON ? {'Content-Type': 'application/json'} : {}});
            },
            patch: function (apiURL, reqBody, isJSON) {
                return $http.patch(apiURL, reqBody, {headers: isJSON ? {'Content-Type': 'application/json'} : {}});
            },
            delete: function (apiURL) {
                // TODO - method to be discussed
                return $http.delete(apiURL);
            }
        };
    }

    authentication.$inject = ['$rootScope', '$location', '_AjaxRequest', 'AUTH_EVENTS', 'PRIVILEGE'];
    function authentication($rootScope, $location, _AjaxRequest, AUTH_EVENTS, PRIVILEGE) {
        return {
            login: function (loginData) {
                _AjaxRequest.post('/api/local-login', loginData, true)
                    .then(
                        function successCallback(result) {
                            window.localStorage.setItem('loginUser', JSON.stringify(result.data));
                            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                            // TODO - show login successful banner
                        },
                        function errorCallback(error) {
                            console.error(error.data);
                            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                            // TODO - show login failed banner
                        }
                    );
            },

            logout: function () {
                _AjaxRequest.get('/api/logout').then(
                    function successCallback(result) {
                        $location.path('/');
                        window.localStorage.clear();
                        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                        // TODO - show logout successful banner
                    },
                    function errorCallback(error) {
                        console.log(error);
                        $rootScope.$broadcast(AUTH_EVENTS.logoutFailed);
                        // TODO - show logout failed banner
                    }
                )
            },

            isAuthenticated: function () {
                return window.localStorage.getItem('loginUser') !== null;
            },

            isAuthorized: function (privilegeValue) {
                // todo: hard-coded for now, need to udpate when server side access privilege checking apis finished.
                if(this.getLoginUser().isLocalUser)
                {
                    // local admin has the maximum privilege
                    return true;
                }
                else {
                    var res = false;
                    angular.forEach(this.getLoginUser().courseEnrolled, function (ce) {
                        var value = 0;
                        if(ce.privilege.name === PRIVILEGE.ACCESS_STUDENT)
                        {
                            value = PRIVILEGE.ACCESS_STUDENT_VALUE;
                        }
                        else if(ce.privilege.name === PRIVILEGE.ACCESS_TA)
                        {
                            value = PRIVILEGE.ACCESS_TA_VALUE;
                        }
                        else if(ce.privilege.name === PRIVILEGE.ACCESS_INSTRUCTOR)
                        {
                            value = PRIVILEGE.ACCESS_INSTRUCTOR_VALUE;
                        }
                        else if(ce.privilege.name === PRIVILEGE.ACCESS_ADMIN)
                        {
                            value = PRIVILEGE.ACCESS_ADMIN_VALUE;
                        }

                        return res || value >= privilegeValue;
                    });
                }
            },

            getLoginUser: function () {
                return JSON.parse(window.localStorage.getItem('loginUser'));
            },

            setLoginUser: function (user) {
                window.localStorage.setItem('loginUser', JSON.stringify(user));
            },

            getDisplayName: function () {
                var loginUser = JSON.parse(window.localStorage.getItem('loginUser'));
                if(loginUser !== null)
                {
                    if (loginUser.name.preferredName) {
                        return loginUser.name.preferredName;
                    } else if (loginUser.name.firstName && loginUser.name.lastName) {
                        return loginUser.name.firstName + ' ' + loginUser.name.lastName;
                    } else {
                        return loginUser.utorid;
                    }
                }
                else{
                    this.logout();
                    return '';
                }
            }
        }
    };

    function utoridAuthentication() {
        return {
            UTORidLogin: function () {
                // we need to use $http service to call our api
                window.location = "/Shibboleth.sso/Login";
            }
        };
    };

    authInterceptor.$inject = ['$rootScope', '$q', 'AUTH_EVENTS'];
    function authInterceptor($rootScope, $q, AUTH_EVENTS) {
        return {
            responseError: function (response) {
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated,
                    403: AUTH_EVENTS.notAuthorized
                }[response.status], response);
                return $q.reject(response);
            }
        };
    };


    loginDialog.$inject = ['_Authentication', 'AUTH_EVENTS'];
    function loginDialog(_Authentication, AUTH_EVENTS) {
        return {
            restrict: 'EA',
            link: function (scope) {
                scope.$on(AUTH_EVENTS.notAuthenticated, function () {
                    _Authentication.logout();
                });
            }
        };
    }

}());
