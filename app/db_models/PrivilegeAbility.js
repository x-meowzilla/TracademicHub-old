var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var abilitySchema = new Schema({

    name: {type: String, required: true},
    description: {type: String},
    codeNumber: {type: Number, index: true, unique: true, required: true}

}, {collection: 'reference-PrivilegeAbilities'});


var abilityModel = mongoose.model('PrivilegeAbility', abilitySchema);
module.exports = abilityModel;
