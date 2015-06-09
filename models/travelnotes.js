/**
 * 驴友日记
 **/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');
//日记模型
var TravelnotesSchema = new Schema({
	title:String,//标题
	start_province:String,//出发省份
	start_city:String,//出发城市
	arrive_place:String,//目的地
	cover_Image:String,//封面图片
	start_time:String,//开始时间
	end_time:String,//结束时间
	per_spending:String,//人均开销
	travel_mode:String,//出行方式
	content:String,//内容
	tips:String,//友情提示
	status:String,//状态
	create_time:{
		type:String,
		default:moment().format("YYYY-MM-DD HH:mm")
	},
	create_time:{
		type:String,
		default:moment().format("YYYY-MM-DD HH:mm")
	},
	update_time:{
		type:String,
		default:moment().format("YYYY-MM-DD HH:mm")
	},
	publish_time:{
		type:String,
		default:moment().format("YYYY-MM-DD HH:mm")
	},
	creator_id:String,
	creator_name:String,
	browser_number:{type:Number,default:0},
	comment_number:{type:Number,default:0},
	share_number:{type:Number,default:0},
	praise_number:{type:Number,default:0},
	collection_number:{type:Number,default:0},
	comments:[]
});

mongoose.model('Travelnotes',TravelnotesSchema);

//旅游日记
var Travelnotes = mongoose.model('Travelnotes');

module.exports = Travelnotes;