var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pointSchema = new Schema({

    assigner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    assignee: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    grantDate: {type: Date, index: true, default: Date.now, required: true},
    value: {type: Number, default: 1, required: true},
    category: {type: Schema.Types.ObjectId, ref: 'PointCategory', required: true}

}, {collection: 'collection-Points'});

pointSchema.statics.findPointData = function (findDoc) {
    "use strict";
    var point = this.model('Point');
    return point.find(findDoc).populate('assigner').populate('assignee').populate('category');
};

pointSchema.statics.deletePointData = function (deleteDoc) {
    "use strict";
    var point = this.model('Point');
    return point.remove(deleteDoc);
};

var PointModel = mongoose.model('Point', pointSchema);
module.exports = PointModel;
