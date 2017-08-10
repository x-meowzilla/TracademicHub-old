User API Documentation
------------

### Local User (Internal Use Only)

+ **CREATE**
    + **Description:** Register a local master user account with admin access privilege.
    + **Request:** ```PUT /api/local-register/```
        + Content-Type: ```application/json```
        + Body:
            + utorid: (string) master account username 
                + _Note: UTORid is the name field for all users._
            + password: (string) master account password
            + firstName: (string) master user first name
            + lastName: (string) master user last name
            + preferredName: (string) [_Optional_]
    + **Response:** 200
        + Content-Type: ```application/json```
        + Body:
            + _id: (string) unique user ID
            + utorid: (string)
            + email: (string)
            + name: (object)
                + firstName: (string)
                + lastName: (string)
                + preferredName: (string) [_Optional_]
            + studentNumber: (string) U of T unique student number [_Optional_]
            + courseEnrolled: (array of object)
                + course: (object)
                    + _id: (string) course ID
                    + name: (string) course name
                    + startDate: (Date) starting date in UTC format
                    + endDate: (Date) ending date in UTC format
                    + academicTerm: (string)
                    + isActive: (boolean)
                + privilege: (object)
                    + _id: (string) unique access privilege ID (ID refer to AccessPrivilege collection)
                    + name: (string) name of this access privilege
                    + value: (number) access privilege value
            + biography: (string) [_Optional_]
            + isActive: (boolean) Return True if this account is active, false otherwise.
            + lastLoginDate: (Date) last login date in UTC format [_Optional_]
    + **Response:** 400
        + Body:
            + errmsg: 'Missing required field "utorid/password/firstName/lastName" in request body.'
    + **Response:** 409
        + Body:
            + errmsg: 'Username "utorid" already exists.'

+ **CREATE**
    + **Description:** Login local master account.
    + **Request:** ```POST /api/local-login/```
        + Content-Type: ```application/json```
        + Body:
            + utorid: (string) master account username
            + password: (string) master account password
    + **Response:** 200
        + Content-Type: ```application/json```
        + Body:
            + _id: (string) unique user ID
            + utorid: (string)
            + email: (string)
            + name: (object)
                + firstName: (string)
                + lastName: (string)
                + preferredName: (string) [_Optional_]
            + studentNumber: (string) U of T unique student number [_Optional_]
            + courseEnrolled: (array of object)
                + course: (object)
                    + _id: (string) course ID
                    + name: (string) course name
                    + startDate: (Date) starting date in UTC format
                    + endDate: (Date) ending date in UTC format
                    + academicTerm: (string)
                    + isActive: (boolean)
                + privilege: (object)
                    + _id: (string) unique access privilege ID (ID refer to AccessPrivilege collection)
                    + name: (string) name of this access privilege
                    + value: (number) access privilege value
            + biography: (string) [_Optional_]
            + isActive: (boolean) Return True if this account is active, false otherwise.
            + lastLoginDate: (Date) last login date in UTC format [_Optional_]
    + **Response:** 400
        + Body:
            + errmsg: 'Missing required field "utorid/password/firstName/lastName" in request body.'
    + **Response:** 401
        + Body:
            + errmsg: 'Login failed. Incorrect Password.'
    + **Response:** 404
        + Body:
            + errmsg: 'Login failed. Username "utorid" does not exist.'


### All Users

+ **CREATE**
    + **Description:** Create student account and save record to database
    + **Request:** ```POST /api/users/```
        + Body: ```form-data```
            + csvfile: (file) student csv file. **Maximum file size: 32MB!**
                + Note: This file should have the following required headers: **UTORiD**, **First Name**, **Last Name**, **Student Number**, **Email**
            + course: (string) unique course ID 
    + **Response:** 200
        + Body: 'Imported from student CSV file. Total # records found: # new student records saved successfully. # existing student records remain unchanged.'
    + **Response:** 400
        + Body:
            + errmsg: 'Student CSV file is not properly formatted.'
    + **Response:** 401
        + Body:
            + errmsg: 'Please login before performing this action.'
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. You must have at least INSTRUCTOR access privilege to perform this action.'
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. Your account is inactive. Please contact instructor to re-activate your account.'

+ **READ**
    + **Description:** Retrieve all users data.
    + **Request:** ```GET /api/users/```
        + By default, this request returns all users in the database
        + **Pre-requisite:**
            + User must login and this account must be activated.
            + User must have minimum TA access privilege.
        + **Query String Options:**
            + _id: (string) unique user ID
            + utorid: (string)
            + email: (string)
            + studentNumber: (number)
            + courseEnrolled: (string) unique courseID
            + isActive: (boolean)
            + firstName: (string)
            + lastName: (string)
            + preferredName: (string)
    + **Response:** 200
        + Content-Type: ```application/json```
        + Body: ```array of object```
            + _id: (string) unique user ID
            + utorid: (string)
            + email: (string)
            + name: (object)
                + firstName: (string)
                + lastName: (string)
                + preferredName: (string) [_Optional_]
            + studentNumber: (string) U of T unique student number [_Optional_]
            + courseEnrolled: (array of object)
                + course: (object)
                    + _id: (string) course ID
                    + name: (string) course name
                    + startDate: (Date) starting date in UTC format
                    + endDate: (Date) ending date in UTC format
                    + academicTerm: (string)
                    + isActive: (boolean)
                + privilege: (object)
                    + _id: (string) unique access privilege ID (ID refer to AccessPrivilege collection)
                    + name: (string) name of this access privilege
                    + value: (number) access privilege value
            + biography: (string) [_Optional_]
            + isActive: (boolean) Return True if this account is active, false otherwise.
            + lastLoginDate: (Date) last login date in UTC format [_Optional_]
    + **Response:** 401
        + Body:
            + errmsg: 'Please login before performing this action.'
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. You must have at least TEACHING ASSISTANT access privilege to perform this action.'
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. Your account is inactive. Please contact instructor to re-activate your account.'

+ **UPDATE**
    + **Description:** update target user basic personal information
    + **Request:** ```PATCH /api/users/:userID/update/user-info```
        + By default, if no query string present, user data is not changed.
        + **Pre-requisite:**
            + User must login and this account must be activated.
        + **Query String Options:**
            + preferredName: (string)
            + biography: (string)
    + **Response:** 200
        + Content-Type: ```application/json```
        + Body:
            + _id: (string) unique user ID
            + utorid: (string)
            + email: (string)
            + name: (object)
                + firstName: (string)
                + lastName: (string)
                + preferredName: (string) [_Optional_]
            + studentNumber: (string) U of T unique student number [_Optional_]
            + courseEnrolled: (array of object)
                + course: (object)
                    + _id: (string) course ID
                    + name: (string) course name
                    + startDate: (Date) starting date in UTC format
                    + endDate: (Date) ending date in UTC format
                    + academicTerm: (string)
                    + isActive: (boolean)
                + privilege: (object)
                    + _id: (string) unique access privilege ID (ID refer to AccessPrivilege collection)
                    + name: (string) name of this access privilege
                    + value: (number) access privilege value
            + biography: (string) [_Optional_]
            + isActive: (boolean) Return True if this account is active, false otherwise.
            + lastLoginDate: (Date) last login date in UTC format [_Optional_]
    + **Response:** 401
        + Body:
            + errmsg: 'Please login before performing this action.'
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. Your account is inactive. Please contact instructor to re-activate your account.'

+ **UPDATE**
    + **Description:** update target user access privilege and activate/deactivate account
    + **Request:** ```PATCH /api/users/:userID/update/user-access```
        + By default, if no query string present, user data is not changed.
        + **Pre-requisite:**
            + User must login and this account must be activated.
            + User must have minimum INSTRUCTOR access privilege.
        + **Query String Options:**
            + firstName: (string)
            + lastName: (string)
            + email: (string)
            + studentNumber: (number)
            + accessPrivilege: (string) access privilege ID
            + isActive: (boolean)
    + **Response:** 200
        + Content-Type: ```application/json```
        + Body:
            + _id: (string) unique user ID
            + utorid: (string)
            + email: (string)
            + name: (object)
                + firstName: (string)
                + lastName: (string)
                + preferredName: (string) [_Optional_]
            + studentNumber: (string) U of T unique student number [_Optional_]
            + courseEnrolled: (array of object)
                + course: (object)
                    + _id: (string) course ID
                    + name: (string) course name
                    + startDate: (Date) starting date in UTC format
                    + endDate: (Date) ending date in UTC format
                    + academicTerm: (string)
                    + isActive: (boolean)
                + privilege: (object)
                    + _id: (string) unique access privilege ID (ID refer to AccessPrivilege collection)
                    + name: (string) name of this access privilege
                    + value: (number) access privilege value
            + biography: (string) [_Optional_]
            + isActive: (boolean) Return True if this account is active, false otherwise.
            + lastLoginDate: (Date) last login date in UTC format [_Optional_]
    + **Response:** 400
        + Body:
            + errmsg: 'You cannot perform this action for yourself.'
    + **Response:** 401
        + Body:
            + errmsg: 'Please login before performing this action.'
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. You must have at least INSTRUCTOR access privilege to perform this action.'
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. Insufficient access privilege to perform this action. Target user has equal or higher access privilege.'
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. Your account is inactive. Please contact instructor to re-activate your account.'

========== insert below ==========

+ **DELETE**
    + **Description:** Logout current user.
    + **Request:** ```GET /api/logout/```
    + **Response:** 200
        + Body: 'Logout successful. Please close the browser to complete the logout process.'
        