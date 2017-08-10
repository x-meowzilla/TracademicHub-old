var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({

    name: {type: String, unique: true, required: true},
    description: {type: String}

}, {collection: 'reference-PointCategory'});

categorySchema.statics.findPointCategoryData = function (findDoc) {
    var category = this.model('PointCategory');
    if (findDoc.name) findDoc.name = {'$regex': '^' + findDoc.name + '$', '$options': 'i'}; // case insensitive
    return category.find(findDoc);
};

categorySchema.statics.deleteCategoryData = function (deleteDoc) {
    var category = this.model('PointCategory');
    return category.remove(deleteDoc);
};

var PointCategoryModel = mongoose.model('PointCategory', categorySchema);
module.exports = PointCategoryModel;
