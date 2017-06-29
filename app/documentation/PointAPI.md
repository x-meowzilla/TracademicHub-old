Point API Documentation
------------

+ **READ**
    + **Description:** Retrieve all points data.
    + **Request:** ```GET /api/points/```
        + By default, this request returns all points record in the database
        + **Pre-requisite:**
            + User must login and this account must be activated.
        + **Query String Options:**
            + _id: (string) unique point ID
            + assignerID: (string) unique user ID
            + assigneeID: (string) unique user ID
            + grantDate: (Date)
            + value: (number) point value
            + categoryID: (boolean) point category ID
    + **Response:** 200
        + Content-Type: ```application/json```
        + Body: ```array of object```
            + _id: (string) unique point ID
            + assignerID: (string)
            + assigneeID: (string)
            + grantDate: (Date) 
            + value: (string) point value
            + categoryID: (string) unique point category ID (ID refer to PointCollection collection)
    + **Response:** 401
        + Body:
            + errmsg: 'Please login before performing this action.'
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. Your account is inactive. Please contact instructor to re-active your account.'
            
+ **CREATE**
    + **Description:** Create and save a point record.
    + **Request:** ```POST /api/points/```
        + **Pre-requisite:**
            + User must login and this account must be activated.
            + User must have minimum TA access privilege.
        + Content-Type: ```application/json```
        + Body:
            + assigneeID: (string) unique user ID
            + pointValue: (number) the value of this point [_Optional_]
            + categoryID: (boolean) point category ID (ID refer to PointCollection collection)
    + **Response:** 200
        + Content-Type: ```application/json```
        + Body:
            + _id: (string) unique point ID
            + assignerID: (string)
            + assigneeID: (string)
            + grantDate: (Date) 
            + value: (string) point value
            + categoryID: (string) unique point category ID (ID refer to PointCollection collection)
    + **Response:** 401
        + Body:
            + errmsg: 'Please login before performing this action.'
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. You must have at least TEACHING ASSISTANT access privilege to perform this action.'
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. Your account is inactive. Please contact instructor to re-active your account.'

+ **DELETE**
    + **Description:** Delete points based on given query string condition.
    + **Request:** ```DELETE /api/points/```
        + By default, if no query string is given, then error raised.
        + **Pre-requisite:**
            + User must login and this account must be activated.
            + User must have minimum INSTRUCTOR access privilege.
        + **Query String Options:**
            + _id: (string) unique point ID
            + assignerID: (string) unique user ID
            + assigneeID: (string) unique user ID
            + grantDate: (Date)
            + value: (number) point value
            + categoryID: (boolean) point category ID
    + **Response:** 200
        + Body: 'Delete succeeded. # records deleted.'
    + **Response:** 200
        + Body: 'Attention: No record has been deleted.'
    + **Response:** 400
        + Body:
            + errmsg: 'Failed to delete. Delete option not found.'
    + **Response:** 401
        + Body:
            + errmsg: 'Please login before performing this action.'
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. You must have at least INSTRUCTOR access privilege to perform this action.'
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. Your account is inactive. Please contact instructor to re-active your account.'
