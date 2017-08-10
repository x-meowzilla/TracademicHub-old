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
            + assigner: (object)
                + _id: (string) assigner ID
                + name: (object)
                    + firstName: (string)
                    + lastName: (string)
                    + preferredName: (string)
            + assignee: (object)
                + _id: (string) assignee ID
                + name: (object)
                    + firstName: (string)
                    + lastName: (string)
                    + preferredName: (string)
            + grantDate: (Date) 
            + value: (string) point value
            + category: (object)
                + _id: (string) unique point category ID (ID refer to PointCategory collection)
                + name: (string) name of the category
                + description: (string) [_Optional_]
    + **Response:** 401
        + Body:
            + errmsg: 'Please login before performing this action.'
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. Your account is inactive. Please contact instructor to re-activate your account.'
            
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
            + pointCategoryID: (boolean) point category ID (ID refer to PointCategory collection)
    + **Response:** 200
        + Content-Type: ```application/json```
        + Body
            + _id: (string) unique point ID
            + assigner: (object)
                + _id: (string) assigner ID
                + name: (object)
                    + firstName: (string)
                    + lastName: (string)
                    + preferredName: (string)
            + assignee: (object)
                + _id: (string) assignee ID
                + name: (object)
                    + firstName: (string)
                    + lastName: (string)
                    + preferredName: (string)
            + grantDate: (Date) 
            + value: (string) point value
            + category: (object)
                + _id: (string) unique point category ID (ID refer to PointCategory collection)
                + name: (string) name of the category
                + description: (string) [_Optional_]
    + **Response:** 401
        + Body:
            + errmsg: 'Please login before performing this action.'
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. You must have at least TEACHING ASSISTANT access privilege to perform this action.'
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. Your account is inactive. Please contact instructor to re-activate your account.'

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
