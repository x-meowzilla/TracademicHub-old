var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accessLevelSchema = new Schema({

    value: {type: Number, required: true, unique: true},
    description: {type: String, required: true, unique: true}

    // visiblePages: // to be discussed.
    // visibleOperation: // to be discussed.

}, {collection: 'AccessLevelsReference'});

var accessLevelModel = mongoose.model('AccessLevel', accessLevelSchema);
module.exports = accessLevelModel;
