User API Documentation
------------

#### Local User (Internal Use Only)

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


#### All Users

+ **DELETE**
    + **Description:** Logout current user.
    + **Request:** ```GET /api/logout/```
    + **Response:** 200
        + Body: 'Logout successful. Please close the browser to complete the logout process.'
        