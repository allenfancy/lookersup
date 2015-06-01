/**
 * 用户
 **/
var util = require('util');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//用户模型
var UserSchema = new Schema({
	 name:String,
	 password:String,
	 openId:String,
	 sex:String,
	 nickname:String,
	 city:String,
	 province:String,
	 country:String,
	 create_time:{type:Date,default:Date.now},
	 update_time:{type:Date,default:Date.now},
	 login_time:{type:Date,default:Date.now},
	 login_account_type:String
});

mongoose.model('User',UserSchema);

var User = mongoose.model('User');

//保存方法





//获取方法