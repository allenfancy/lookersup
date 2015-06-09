/**
 * 评论
 * 
 * */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

//评论模型
var CommentSchema = new Schema({
	comment_user_id:String,
	comment_user_nickname:String,
	comment_content:String,
	comment_time:{
		type:Date,
		default:moment().format("YYYY-MM-DD HH:mm")
	},
	//delete_flag:null//删除标志
});

mongoose.model('Comment',CommentSchema);

//评论模型
var Comment = mongoose.model('Comment');

module.exports = Comment;