var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pointCategorySchema = new Schema({

    name: {type: String, unique: true, required: true}

}, {collection: 'PointCategoryReference'});

pointCategorySchema.statics.getAllCategoryNames = function () {
    var category = this.model('PointCategory');
    return category.find({});
};

pointCategorySchema.statics.findByCategoryName = function (categoryName) {
    var category = this.model('PointCategory');
    return category.findOne({name: categoryName})
};

pointCategorySchema.statics.deleteByCategoryName = function (categoryName) {
    var category = this.model('PointCategory');
    return category.remove({name: categoryName});
};

var PointCategoryModel = mongoose.model('PointCategory', pointCategorySchema);
module.exports = PointCategoryModel;
