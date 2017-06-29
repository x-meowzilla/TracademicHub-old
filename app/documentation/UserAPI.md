User API Documentation
------------

### Local User (Internal Use Only)

+ **CREATE**
    + **Description:** Register a local master user account with admin access privilege.
    + **Request:** ```POST /api/local-register/```
        + Content-Type: ```application/json```
        + Body:
            + utorid: (string) master account username 
                + _Note: UTORid is the name field for all users._
            + password: (string) master account password
            + firstName: (string) master user first name
            + lastName: (string) master user last name
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
            + accessPrivilege: (string) unique access privilege ID (ID refer to AccessPrivilege collection)
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
            + accessPrivilege: (string) unique access privilege ID (ID refer to AccessPrivilege collection)
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
            + accessPrivilege: (string) access privilege ID
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
            + accessPrivilege: (string) unique access privilege ID (ID refer to AccessPrivilege collection)
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
            + errmsg: 'Permission denied. Your account is inactive. Please contact instructor to re-active your account.'

+ **UPDATE**
    + **Description:** update target user basic personal information
    + **Request:** ```PATCH /api/users/:userID/update/user-info```
        + By default, if no query string present, user data is not changed.
        + **Pre-requisite:**
            + User must login and this account must be activated.
        + **Query String Options:**
            + firstName: (string)
            + lastName: (string)
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
            + accessPrivilege: (string) unique access privilege ID (ID refer to AccessPrivilege collection)
            + biography: (string) [_Optional_]
            + isActive: (boolean) Return True if this account is active, false otherwise.
            + lastLoginDate: (Date) last login date in UTC format [_Optional_]
    + **Response:** 401
        + Body:
            + errmsg: 'Please login before performing this action.'
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. Your account is inactive. Please contact instructor to re-active your account.'
    + **Response:** 400
        + Body:
            + errmsg: 'You cannot perform this action for yourself.'
    + **Response:** 401
        + Body:
            + errmsg: 'Please login before performing this action.'
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. Insufficient access privilege to perform this action. Target user has equal or higher access privilege.'
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. Your account is inactive. Please contact instructor to re-active your account.'

========== insert below ==========

+ **DELETE**
    + **Description:** Logout current user.
    + **Request:** ```GET /api/logout/```
    + **Response:** 200
        + Body: 'Logout successful. Please close the browser to complete the logout process.'
        