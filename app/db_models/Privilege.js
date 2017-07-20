var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var privilegeSchema = new Schema({

    name: {type: String, required: true},
    course: {type: Schema.Types.ObjectId, ref: 'Course', required: true},
    operations: [{type: Schema.Types.ObjectId, ref: ''}]

}, {collection: 'collection-RolePrivileges'});


var privilegeModel = mongoose.model('RolePrivilege', privilegeSchema);
module.exports = privilegeModel;
