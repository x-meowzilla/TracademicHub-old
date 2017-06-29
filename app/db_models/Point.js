var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pointSchema = new Schema({

    assignerID: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    assigneeID: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    grantDate: {type: Date, default: Date.now, required: true},
    value: {type: Number, default: 1, required: true},
    categoryID: {type: Schema.Types.ObjectId, ref: 'PointCategory', required: true}

}, {collection: 'PointsCollection'});

pointSchema.statics.findPointData = function (findDoc) {
    "use strict";
    var point = this.model('Point');
    return point.find(findDoc);
};

pointSchema.statics.deletePointData = function (deleteDoc) {
    "use strict";
    var point = this.model('Point');
    return point.remove(deleteDoc);
};

var PointModel = mongoose.model('Point', pointSchema);
module.exports = PointModel;
