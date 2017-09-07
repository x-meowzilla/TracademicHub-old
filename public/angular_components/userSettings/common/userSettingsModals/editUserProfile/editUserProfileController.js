(function () {
    'use strict';

    angular
        .module('TracademicHub')
        .controller('editUserProfileController', function ($scope, $uibModalInstance, _AjaxRequest, _Authentication, PRIVILEGE, getCurrentUser) {
            $scope.getCurrentUser = function () {
              return getCurrentUser;
            };
            $scope.authorizedPrivilege = PRIVILEGE;
            $scope.isAuthorized = function (value) {
                // todo: hard-coded for now, need to udpate when server side access privilege checking apis finished.
                return _Authentication.isAuthorized(value);
            };

            // edit profile form
            $scope.courses = [];
            (function () {
                if($scope.getCurrentUser().isLocalUser)
                {
                    // local admin can get view all courses
                    _AjaxRequest.get('/api/courses?' + $.param({isActive: true}))
                        .then(
                            function successCallback(result) {
                                $scope.courses = result.data;
                            },
                            function errorCallback(error) {
                                console.error(error);
                            }
                        )
                }
                else
                {
                    // get the courses that current user has access to.
                    var courseIds = [];
                    angular.forEach($scope.getCurrentUser().courseEnrolled, function (item) {
                        var courseId = item.course._id;
                        if(courseIds.indexOf(courseId) < 0)
                        {
                            _AjaxRequest.get('/api/courses?' + $.param({_id: courseId}))
                                .then(
                                    function successCallback(result) {
                                        if(result.data.length > 0)
                                        {
                                            $scope.courses.push(result.data[0]);
                                            courseIds.push(result.data[0]._id);
                                        }
                                    },
                                    function errorCallback(error) {
                                        console.error(error);
                                    }
                                );
                        }
                    });
                }
            }());

            $scope.editUserInfo = $scope.getCurrentUser();
            $scope.editUserInfo.inputimage =
                $scope.getCurrentUser().avatarPath? $scope.getCurrentUser().avatarPath: "../images/default-avatar.png";

            // update user information
            $scope.updateUserProfile = function () {
                var updateBasicInfo = {};
                if($scope.editUserProfileForm.preferredName.$dirty)
                {
                    updateBasicInfo["preferredName"] = $scope.editUserInfo.name.preferredName;
                }
                if($scope.editUserProfileForm.biography.$dirty)
                {
                    updateBasicInfo["biography"] = $scope.editUserInfo.biography;
                }
                if(!angular.equals({}, updateBasicInfo))
                {
                    _AjaxRequest.patch('/api/users/' + $scope.getCurrentUser()._id + '/update/user-info?' + $.param(updateBasicInfo))
                        .then(
                            function successCallback(result) {
                                if($scope.getCurrentUser()._id === _Authentication.getLoginUser()._id)
                                {
                                    _Authentication.setLoginUser(result.data);
                                }
                                $scope.clearForm();
                                // close modal
                                $scope.closeForm();
                                // todo: profile updated banner
                            },
                            function errorCallback(error) {
                                console.error(error);
                            }
                        );
                }

                var updateMoreInfo = {};
                if($scope.editUserProfileForm.firstName.$dirty)
                {
                    updateMoreInfo["firstName"] = $scope.editUserInfo.name.firstName;
                }
                if($scope.editUserProfileForm.lastName.$dirty)
                {
                    updateMoreInfo["lastName"] = $scope.editUserInfo.name.lastName;
                }
                if($scope.editUserProfileForm.email.$dirty)
                {
                    updateMoreInfo["email"] = $scope.editUserInfo.email;
                }
                var privilege = $scope.editUserInfo.selectedPrivilege;
                if(!angular.isUndefined(privilege) && privilege !== null)
                {
                    updateMoreInfo["accessPrivilege"] = privilege._id;
                }
                if(!angular.equals({}, updateMoreInfo))
                {
                    console.log(updateMoreInfo);
                    _AjaxRequest.patch('/api/users/' + $scope.getCurrentUser()._id + '/update/user-access?' + $.param(updateMoreInfo))
                        .then(
                            function successCallback(result) {
                                if($scope.getCurrentUser()._id === _Authentication.getLoginUser()._id)
                                {
                                    _Authentication.setLoginUser(result.data);
                                }
                                $scope.clearForm();
                                // todo: profile updated banner
                            },
                            function errorCallback(error) {
                                console.error(error);
                            }
                        );
                }

            };

            // check validation of input access privilege field
            $scope.$watchGroup(['selectedCourse', 'selectedPrivilege'], function(newValues, oldValues, scope) {
                if(angular.isUndefined(newValues[1]) || newValues[1] === null)
                {
                    $scope.editUserProfileForm.course.$setPristine();
                }
            });

            $scope.clearForm = function () {
                // close modal
                $uibModalInstance.dismiss('cancel');
                $scope.editUserInfo = $scope.getCurrentUser();
                $scope.editUserProfileForm.$setPristine();
                $scope.editUserProfileForm.$setUntouched();
            };

            $scope.closeForm = function () {
                $uibModalInstance.close();
            };
        });

}());
