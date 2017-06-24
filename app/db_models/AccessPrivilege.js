var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var privilegeSchema = new Schema({

    value: {type: Number, required: true, unique: true},
    description: {type: String, required: true, unique: true}

}, {collection: 'AccessPrivilegeReference'});


privilegeSchema.statics.findByPrivilegeValueAndDescription = function (accessValue, description) {
    var access = this.model('AccessPrivilege');
    return access.findOne({value: accessValue, description: description});
};

privilegeSchema.statics.findTest = function (reqUserAccessID, targetUserAccessID) {

    // TODO - still under construction

    var access = this.model('AccessPrivilege');
    return access.find({_id: {$in: [mongoose.Types.ObjectId(reqUserAccessID), mongoose.Types.ObjectId(targetUserAccessID)]}});
};

var privilegeModel = mongoose.model('AccessPrivilege', privilegeSchema);
module.exports = privilegeModel;
