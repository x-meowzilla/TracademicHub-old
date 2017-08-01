var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var archiveSchema = new Schema({

    // TODO - redesign archive

}, {collection: 'collection-Archives'});


var ArchiveModel = mongoose.model('Archive', archiveSchema);
module.exports = ArchiveModel;
