/**
 * 驴友日记
 **/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//日记模型
var TravelnotesSchema = new Schema({
	title:String,
	content:String,
	consts:String,
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

//保存方法


//按照ID获取

//获取集合

//修改