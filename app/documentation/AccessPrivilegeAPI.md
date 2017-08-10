Access Privilege API Documentation
------------

+ **READ**
    + **Description:** Retrieve all access privilege data.
    + **Request:** ```GET /api/privileges/```
        + By default, this request returns all access privilege records in the database
        + **Pre-requisite:**
            + User must login and this account must be activated.
            + User must have minimum INSTRUCTOR access privilege.
        + **Query String Options:**
            + _id: (string) unique access privilege ID
            + value: (number) unique access privilege value
            + description: (string) unique point category description
    + **Response:** 200
        + Content-Type: ```application/json```
        + Body: ```array of object```
            + _id: (string) unique access privilege ID
            + name: (string) privilege name
            + course: (object)
                + _id: (string) course ID
                + name: (string) course name
                + startDate: (Date) starting date in UTC format
                + endDate: (Date) ending date in UTC format
                + academicTerm: (string)
                + isActive: (boolean)
            + value: (number) unique access privilege value
    + **Response:** 401
        + Body:
            + errmsg: 'Please login before performing this action.'
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. You must have at least INSTRUCTOR access privilege to perform this action.'    
    + **Response:** 403
        + Body:
            + errmsg: 'Permission denied. Your account is inactive. Please contact instructor to re-activate your account.'

+ **DELETE (Temporarily Disabled)**
    + **Description:** Delete access privilege based on given query string condition.
    + **Request:** ```DELETE /api/privileges/```
        + By default, if no query string is given, then error raised.
        + **Pre-requisite:**
            + User must login and this account must be activated.
            + User must have minimum INSTRUCTOR access privilege.
        + **Query String Options:**
            + _id: (string) unique access privilege ID
            + value: (number) unique access privilege value
            + name: (string) access privilege name
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
