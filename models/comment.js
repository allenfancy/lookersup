/**
 * 评论
 * 
 * */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//评论模型
var CommentSchema = new Schema({
	comment_user_id:String,
	comment_content:String,
	comment_time:{
		type:Date,
		default:Date.now
	},
	delete_flag://删除标志
});

mongoose.model('Comment',CommentSchema);

//评论模型
var Comment = mongoose.model('Comment');
