/**
 * 驴友
 **/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//驴友模型
var DonkeyfriendSchema = new Schema({
	
	title：String,//标题
    title_page：String,//封面url
    routes：String,//路线
    application_conditions：String,//申请条件
    content：String,//具体内容
    other_reason:String,//其他要求
    commit_time:{
    	type:Date,
    	default:Date.now
    },
    update_time:{
    	type:Date,
		default:Date.now
    }
}); 

mongoose.model('Donkeyfriend',DonkeyfriendSchema);

//驴友模型
var Donkeyfriend = mongoose.model('Donkeyfriend');

module.exports = Donkeyfriend;