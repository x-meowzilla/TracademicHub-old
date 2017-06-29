var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pointCategorySchema = new Schema({

    name: {type: String, unique: true, required: true}

}, {collection: 'PointCategoryReference'});

pointCategorySchema.statics.getPointCategoryData = function () {
    var category = this.model('PointCategory');
    return category.find({});
};

pointCategorySchema.statics.findByPointCategoryName = function (categoryName) {
    var category = this.model('PointCategory');
    return category.findOne({name: {'$regex': '^' + categoryName + '$', '$options': 'i'}});
    // return category.findOne({name: categoryName})
};

pointCategorySchema.statics.deleteCategoryData = function (deleteDoc) {
    var category = this.model('PointCategory');
    return category.remove(deleteDoc);
};

var PointCategoryModel = mongoose.model('PointCategory', pointCategorySchema);
module.exports = PointCategoryModel;
