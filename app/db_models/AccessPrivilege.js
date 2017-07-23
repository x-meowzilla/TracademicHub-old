var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var privilegeSchema = new Schema({

    name: {type: String, unique: true, required: true},
    description: {type: String},
    course: {type: Schema.Types.ObjectId, ref: 'Course', required: true},
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


var privilegeModel = mongoose.model('AccessPrivilege', privilegeSchema);
module.exports = privilegeModel;
