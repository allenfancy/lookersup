/**
 * 统计
 **/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//统计模型
var StatisticsSchema =  new Schema({
	browser_number:{type:Number,default:0},
	comment_number:{type:Number,default:0},
	share_number:{type:Number,default:0},
	praise_number:{type:Number,default:0},
	collection_number:{type:Number,default:0}
});


mongoose.model('Statistics',StatisticsSchema);

//统计
var Statistics = mongoose.model('Statistics');

//更新统计的数据

