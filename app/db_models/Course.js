var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var courseSchema = new Schema({

    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    name: {type: String, required: true, unique: true},
    term: {type: String},
    rolePrivileges: [{type: Schema.Types.ObjectId, ref: 'RolePrivilege'}],
    isActive: {type: Boolean, default: true, required: true}

}, {collection: 'collection-Courses'});


var CourseModel = mongoose.model('Course', courseSchema);
module.exports = CourseModel;
