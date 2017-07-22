var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var courseSchema = new Schema({

    startDate: {type: Date, index: true, required: true},
    endDate: {type: Date, index: true, required: true},
    name: {type: String, required: true},
    description: {type: String},
    academicTerm: {type: String, required: true},
    userPrivileges: [{type: Schema.Types.ObjectId, ref: 'AccessPrivilege', unique: true}],
    isActive: {type: Boolean, default: true, required: true}

}, {collection: 'collection-Courses'});


courseSchema.statics.findCourseData = function (findDoc) {
    "use strict";
    var course = this.model('Course');
    if (findDoc.startDate) findDoc.startDate = {'$gte': new Date(findDoc.startDate)};
    if (findDoc.endDate) findDoc.endDate = {'$lte': new Date(findDoc.endDate)};
    if (findDoc.name) findDoc.name = {'$regex': '^' + findDoc.name + '$', '$options': 'i'};
    if (findDoc.academicTerm) findDoc.academicTerm = {'$regex': '^' + findDoc.academicTerm + '$', '$options': 'i'};
    return course.find(findDoc).populate('userPrivileges');
};

courseSchema.statics.updateCourseData = function (courseID, updateDoc) {
    "use strict";
    var course = this.model('Course');
    return course.findByIdAndUpdate(courseID, {$set: updateDoc}, {new: true}).populate('userPrivileges');
};

var CourseModel = mongoose.model('Course', courseSchema);
module.exports = CourseModel;
