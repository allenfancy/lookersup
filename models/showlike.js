var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//表示喜欢模型
var ShowLikeSchema = new Schema({
    travelnotes_id:{type:String},
	showlike_user_id:{type:String}
});

mongoose.model('ShowLike',ShowLikeSchema);

//评价模型
var ShowLike = mongoose.model('ShowLike');

module.exports = ShowLike