var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({

    description: {type: String, unique: true, required: true}

}, {collection: 'reference-PointCategory'});

categorySchema.statics.findPointCategoryData = function (findDoc) {
    var category = this.model('PointCategory');
    if (findDoc.description) findDoc.description = {'$regex': '^' + findDoc.description + '$', '$options': 'i'}; // case insensitive
    return category.find(findDoc);
};

categorySchema.statics.deleteCategoryData = function (deleteDoc) {
    var category = this.model('PointCategory');
    return category.remove(deleteDoc);
};

var PointCategoryModel = mongoose.model('PointCategory', categorySchema);
module.exports = PointCategoryModel;
