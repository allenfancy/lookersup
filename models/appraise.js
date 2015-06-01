/**
 * 评价模型
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//评价模型
var AppraiseSchema = new Schema({
	stars:{type:Number,default:0}
	content:{type:String},
	comment_user_id:{type:String}
});

mongoose.model('Appraise',AppraiseSchema);

//评价模型
var Travelnotes = mongoose.model('Appraise');
