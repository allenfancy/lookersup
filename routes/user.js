var Travelnotes = require('../models/travelnotes');
var Statistics = require('../models/statistics');
var markdown = require('markdown').markdown;
var fs = require('fs');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick : true });
var moment = require('moment');

/***
 * 首先 在ubuntu 上面安装  sudo apt-get install imagemagick
 * 
 */
module.exports = function(app) {
	// 跳入到用户中心
	app.get('/user/userHome', function(req, res) {
		console.log('现在我要去用户中心了');
		if (req.session.user) {
			Travelnotes.find({"creator_id":req.session.user._id}, null, {
				limit : 10,
				sort : {
					update_time : -1
				}
			}, function(err, docs) {
			
				res.render('userhome', {
					title : '用户中心',
					user : req.session.user,
					travelnotes : docs
				});
			});
		} else {
			req.session.error = "用戶登陸信息已經過期，請重新登陸";
			res.redirect('/login');
		}
	});
	
	
}
