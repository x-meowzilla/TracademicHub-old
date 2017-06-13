var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pointCategorySchema = new Schema({

    name: {type: String, unique: true, required: true}

}, {collection: 'PointCategoryReference'});


var PointCategoryModel = mongoose.model('PointCategory', pointCategorySchema);
module.exports = PointCategoryModel;
