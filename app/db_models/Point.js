var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pointSchema = new Schema({

    assigner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    assignee: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    grantDate: {type: Date, index: true, default: Date.now, required: true},
    value: {type: Number, default: 1, required: true},
    // course: {type: Schema.Types.ObjectId, ref: 'Course', required: true},
    category: {type: Schema.Types.ObjectId, ref: 'PointCategory', required: true}

}, {collection: 'collection-Points'});

pointSchema.statics.findPointData = function (findDoc) {
    "use strict";
    var point = this.model('Point');
    return point.find(findDoc)
        .populate('assigner', ['_id', 'name'])
        .populate('assignee', ['_id', 'name'])
        // .populate('course', ['_id', 'name', 'startDate', 'endDate', 'academicTerm', 'isActive'])
        .populate('category');
};

pointSchema.statics.deletePointData = function (deleteDoc) {
    "use strict";
    var point = this.model('Point');
    return point.remove(deleteDoc);
};

pointSchema.statics.getPointsByPeriod = function (req) {
    "use strict";
    var point = this.model('Point');

    return point.aggregate([
        {"$match": {
            $and: [
                {"assignee": mongoose.Types.ObjectId(req.userID)},
                {"grantDate": {$gt: new Date(req.startDate), $lt: new Date(req.endDate)}}
            ]
        }},
        {"$group": {
            "_id": {date:{$dayOfMonth:"$grantDate"}, month:{$month:"$grantDate"}, year:{$year:"$grantDate"}, "category": "$category"},
            "date": {$first: "$grantDate"},
            "category": {$first: "$category"},
            "totalPoints": {"$sum": '$value'}
        }},
        {"$sort": {"totalPoints": -1}},
        {"$project": {
            "_id": 0,
            "date": 1,
            "category": 1,
            "totalPoints": 1
        }}
    ]);
};

pointSchema.statics.getPointsSum = function (req) {
    "use strict";
    var point = this.model('Point');

    var filter = [];

    var categoryID = req.pointCategoryID;
    if(categoryID)
    {
        filter.push(
            {"$match": {
                "category": mongoose.Types.ObjectId(categoryID)
            }}
        );
    }

    var assigneeID = req.assigneeID;
    if(assigneeID)
    {
        filter.push(
            {"$match": {
                "assignee": mongoose.Types.ObjectId(assigneeID)
            }}
        );
    }

    // not working for some reason... comment it for now
    // filter.push(
    //     {"$lookup": {
    //         from: "Point",
    //         localField: "_id",
    //         foreignField: "_id",
    //         as: "point"
    //     }},
    //     {$unwind: "$point"},
    //     {"$project": {
    //         "assigneeData": "$point.assignee"
    //     }}
    // );

    filter.push(
        {"$group": {
            "_id": '$assignee',
            "totalPoints": {"$sum": '$value'}
        }},
        {"$sort": {"totalPoints": -1}},
        {"$project": {
            "totalPoints": 1
        }}
    );

    return point.aggregate([filter]);
};

var PointModel = mongoose.model('Point', pointSchema);
module.exports = PointModel;
