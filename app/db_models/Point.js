var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pointSchema = new Schema({

    assigner: {
        id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        name: {type: String, required: true}
    },
    assignee: {
        id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        name: {type: String, required: true}
    },
    grantDate: {type: Date, default: Date.now, required: true},
    value: {type: Number, required: true}

}, {collection: 'PointsReference'});


var PointModel = mongoose.model('Point', pointSchema);
module.exports = PointModel;