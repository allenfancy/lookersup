/**
 * 驴友日记
 **/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//日记模型
var TravelnotesSchema = new Schema({
	title:String,//标题
	start_province:String,//出发省份
	start_city:String,//出发城市
	arrive_place:String,//目的地
	cover_Image:String,//封面图片
	start_time:Date,//开始时间
	end_time:Date,//结束时间
	per_spending:String,//人均开销
	travel_mode:String,//出行方式
	content:String,//内容
	tips:String,//友情提示
	status:String,//状态
	create_time:{
		type:Date,
		default:Date.now
	},
	create_time:{
		type:Date,
		default:Date.now
	},
	update_time:{
		type:Date,
		default:Date.now
	},
	publish_time:{
		type:Date,
		default:Date.now
	},
	creator_id:String,
	comment:[],//评论
	staticstic:[],//统计
	appraise:[]//评价
});

mongoose.model('Travelnotes',TravelnotesSchema);

//旅游日记
var Travelnotes = mongoose.model('Travelnotes');

module.exports = Travelnotes;