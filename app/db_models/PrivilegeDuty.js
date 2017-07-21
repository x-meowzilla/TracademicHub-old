var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var responsibilitySchema = new Schema({

    name: {type: String, required: true},
    description: {type: String},
    codeNumber: {type: Number, index: true, unique: true, required: true}

}, {collection: 'collection-PrivilegeDuties'});


var responsibilityModel = mongoose.model('PrivilegeDuty', responsibilitySchema);
module.exports = responsibilityModel;
