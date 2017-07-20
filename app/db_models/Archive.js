var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var archiveSchema = new Schema({

    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    course: {type: String, required: true},
    description: {type: String, unique: true, required: true},

    students: [{type: Schema.Types.ObjectId, ref: 'User'}],
    points: [{type: Schema.Types.ObjectId, ref: 'Point'}]


}, {collection: 'collection-Archive'});

var ArchiveModel = mongoose.model('Archive', archiveSchema);
module.exports = ArchiveModel;
