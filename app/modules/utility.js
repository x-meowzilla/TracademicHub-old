module.exports.ACCESS_STUDENT = 'Student';

module.exports.ACCESS_TA = 'Teaching Assistant';

module.exports.ACCESS_INSTRUCTOR = 'Instructor';

module.exports.ACCESS_ADMIN = 'Admin';

module.exports.retrieveBasicUserData = function (user) {
    "use strict";

    return {
        _id: user._id,
        utorid: user.utorid,
        email: user.email,
        name: user.name,
        studentNumber: user.studentNumber,
        accessPrivilege: {
            _id: user.accessPrivilege._id,
            value: user.accessPrivilege.value,
            description: user.accessPrivilege.description
        },
        biography: user.biography,
        isActive: user.isActive,
        lastLoginDate: user.lastLoginDate
    };

};

module.exports.retrieveBasicPointData = function (point) {
    "use strict";

    return {
        _id: point._id,
        assigner: {
            _id: point.assigner._id,
            name: point.assigner.name
        },
        assignee: {
            _id: point.assignee._id,
            name: point.assignee.name
        },
        value: point.value,
        category: {
            _id: point.category._id,
            name: point.category.name
        },
        grantDate: point.grantDate
    };

};
