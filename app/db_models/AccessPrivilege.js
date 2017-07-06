var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var privilegeSchema = new Schema({

    value: {type: Number, required: true, unique: true},
    description: {type: String, required: true, unique: true}

}, {collection: 'reference-AccessPrivilege'});


privilegeSchema.statics.findByIds = function (reqUserAccessID, targetUserAccessID) {
    "use strict";
    // this method will return 2 access privilege objects to compare the value
    var access = this.model('AccessPrivilege');
    return access.find({_id: {$in: [mongoose.Types.ObjectId(reqUserAccessID), mongoose.Types.ObjectId(targetUserAccessID)]}});
};

privilegeSchema.statics.findAccessPrivilegeData = function (findDoc) {
    "use strict";
    var access = this.model('AccessPrivilege');
    return access.find(findDoc);
};

privilegeSchema.statics.deleteAccessPrivilegeData = function (deleteDoc) {
    "use strict";
    var access = this.model('AccessPrivilege');
    return access.remove(deleteDoc);
};

var privilegeModel = mongoose.model('AccessPrivilege', privilegeSchema);
module.exports = privilegeModel;
