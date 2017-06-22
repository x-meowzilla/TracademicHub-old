module.exports.retrieveBasicUserData = function (user) {
    "use strict";

    return {
        _id: user._id,
        utorid: user.utorid,
        email: user.email,
        name: user.name,
        studentNumber: user.studentNumber,
        accessLevel: user.accessLevel,
        biography: user.biography
    }

};
