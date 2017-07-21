var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var privilegeSchema = new Schema({

    name: {type: String, required: true},
    description: {type: String},
    course: {type: Schema.Types.ObjectId, ref: 'Course', required: true},
    responsibility: [{type: Schema.Types.ObjectId, ref: 'PrivilegeDuty', index: true}]

}, {collection: 'collection-RolePrivileges'});


var privilegeModel = mongoose.model('RolePrivilege', privilegeSchema);
module.exports = privilegeModel;
