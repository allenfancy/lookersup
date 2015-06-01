/**
 * 地主
 **/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//地主模型
var LandlordSchema = new Schema({
	title:String,
	title_page:String,//封面  url
	city:String,
	application_conditions:String,//申请条件
	landlord_introdction:String,//地主介绍
	landlord_require:String,//地主要求
	other_reason:String,//其他要求
	appraise:[]//评价
});

mongoose.model('Landlord',LandlordSchema);

//地主模型
var Landlord = mongoose.model('Landlord');
