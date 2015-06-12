var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CollectionSchema = new Schema({
    travelnotes_id:{type:String},
	collection_user_id:{type:String}
});

mongoose.model('Collections',CollectionSchema);

//评价模型
var Collections = mongoose.model('Collections');

module.exports = Collections
