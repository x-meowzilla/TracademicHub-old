module.exports.ACCESS_STUDENT = 10;
module.exports.ACCESS_STUDENT_DESCRIPTION = 'Student';

// module.exports.ACCESS_KIOSK = 15;
// module.exports.ACCESS_KIOSK_DESCRIPTION = 'Kiosk';

module.exports.ACCESS_TA = 30;
module.exports.ACCESS_TA_DESCRIPTION = 'Teaching Assistant';

module.exports.ACCESS_INSTRUCTOR = 50;
module.exports.ACCESS_INSTRUCTOR_DESCRIPTION = 'Instructor';

module.exports.ACCESS_ADMIN = 100;
module.exports.ACCESS_ADMIN_DESCRIPTION = 'Admin';

module.exports.retrieveBasicUserData = function (user) {
    "use strict";

    return {
        _id: user._id,
        utorid: user.utorid,
        email: user.email,
        name: user.name,
        studentNumber: user.studentNumber,
        accessLevel: user.accessPrivilege,
        biography: user.biography,
        lastLoginDate: user.lastLoginDate
    }

};
