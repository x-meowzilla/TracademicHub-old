Point Category API Documentation
------------

+ **READ**
    + **Description:** Retrieve all point category data.
    + **Request:** ```GET /api/points-category/```
        + By default, this request returns all point category records in the database
        + **Pre-requisite:**
            + User must login and this account must be activated.
        + **Query String Options:**
            + _id: (string) unique point category ID
            + description: (string) unique point category description
    + **Response:** 200
        + Content-Type: ```application/json```
        + Body: ```array of object```
            + _id: (string) unique point category ID
            + name: (string) unique point category description
    + **Response:** 401
        + Body:
            + errmsg: 'Please login before performing this action.'
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. Your account is inactive. Please contact instructor to re-activate your account.'
            
+ **CREATE**
    + **Description:** Create and save a point category record.
    + **Request:** ```PUT /api/points-category/```
        + **Pre-requisite:**
            + User must login and this account must be activated.
            + User must have minimum INSTRUCTOR access privilege.
        + Content-Type: ```application/json```
        + Body:
            + description: (string) unique point category description
    + **Response:** 200
        + Content-Type: ```application/json```
        + Body:
            + _id: (string) unique point category ID
            + description: (string) unique point category description
    + **Response:** 401
        + Body:
            + errmsg: 'Please login before performing this action.'
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. You must have at least INSTRUCTOR access privilege to perform this action.'
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. Your account is inactive. Please contact instructor to re-activate your account.'
    + **Response:** 409
        + Body:
            + errmsg: 'Failed to create point category. 'Category' category exists.'

+ **DELETE**
    + **Description:** Delete point category records based on given query string condition.
    + **Request:** ```DELETE /api/points-category/```
        + By default, if no query string is given, then error raised.
        + **Pre-requisite:**
            + User must login and this account must be activated.
            + User must have minimum INSTRUCTOR access privilege.
        + **Query String Options:**
            + _id: (string) unique point category ID
            + description: (string) unique point category description
    + **Response:** 200
        + Body: 'Delete succeeded. # records deleted.'
    + **Response:** 200
        + Body: 'No record has been deleted.'
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
            + errmsg: 'Permission denied. Your account is inactive. Please contact instructor to re-activate your account.'
