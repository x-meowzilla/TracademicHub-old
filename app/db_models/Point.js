var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pointSchema = new Schema({

    assigner: {
        id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        name: {
            firstName: {type: String, required: true},
            lastName: {type: String, required: true},
            preferredName: {type: String, required: true}
        }
    },
    assignee: {
        id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        name: {
            firstName: {type: String, required: true},
            lastName: {type: String, required: true},
            preferredName: {type: String, required: true}
        }
    },
    grantDate: {type: Date, default: Date.now, required: true},
    value: {type: Number, default: 1, required: true},
    category: {type: Schema.Types.ObjectId, ref: 'PointCategory', required: true}

}, {collection: 'PointsCollection'});

pointSchema.statics.getAllHistory = function () {
    var point = this.model('Point');
    return point.find({});
};

pointSchema.statics.getHistoryByAssignerID = function (assignerID) {
    var point = this.model('Point');
    return point.find({assigner: {id: assignerID}});
};

pointSchema.statics.getHistoryByAssigneeID = function (assigneeID) {
    var point = this.model('Point');
    return point.find({assignee: {id: assigneeID}});
};

pointSchema.statics.deleteByID = function (pointID) {
    var point = this.model('Point');
    return point.remove({_id: pointID});
};

var PointModel = mongoose.model('Point', pointSchema);
module.exports = PointModel;
