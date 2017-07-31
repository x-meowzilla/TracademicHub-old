var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('../modules/utility');

var privilegeSchema = new Schema({

    name: {type: String, required: true},
    course: {type: Schema.Types.ObjectId, ref: 'Course', index: true, required: true},
    ability: [{type: Schema.Types.ObjectId, ref: 'PrivilegeAbility', index: true}]

}, {collection: 'collection-AccessPrivileges'});


privilegeSchema.statics.findAccessPrivilegeData = function (findDoc) {
    "use strict";
    var privilege = this.model('AccessPrivilege');
    if (findDoc.name) findDoc.name = {'$regex': '^' + findDoc.name + '$', '$options': 'i'}; // case insensitive
    if (findDoc.description) findDoc.description = {'$regex': '^' + findDoc.description + '$', '$options': 'i'}; // case insensitive
    return privilege.find(findDoc)
        .populate('course', ['startDate', 'endDate', 'name', 'academicTerm', 'isActive'])  // only populate the data we need
        .populate('ability');
};

privilegeSchema.statics.createDefaultPrivileges = function (courseID) {
    "use strict";
    var privilege = this.model('AccessPrivilege');
    var privilegeArray = [{name: util.ACCESS_ADMIN, description: util.ACCESS_ADMIN, course: courseID},
        {name: util.ACCESS_INSTRUCTOR, description: util.ACCESS_INSTRUCTOR, course: courseID},
        {name: util.ACCESS_TA, description: util.ACCESS_TA, course: courseID},
        {name: util.ACCESS_STUDENT, description: util.ACCESS_STUDENT, course: courseID}];
    return privilege.insertMany(privilegeArray);
};

var privilegeModel = mongoose.model('AccessPrivilege', privilegeSchema);
module.exports = privilegeModel;
