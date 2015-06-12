var Travelnotes = require('../models/travelnotes');
var Collections = require('../models/collection');




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
				sort : {
					update_time : -1
				}
			}, function(err, docs) {
				if(err){
					console.log('出现错误了');
				}else{
					Collections.find({"collection_user_id":req.session.user._id},function(err,docs1){
						if(err){
							console.log('出错了');
						}else{
							res.render('userhome', {
								title : '用户中心',
								user : req.session.user,
								travelnotes : docs,
								collection_numbers:docs1.length
							});
						}
					
				});
				}
			});
		} else {
			req.session.error = "用戶登陸信息已經過期，請重新登陸";
			res.redirect('/login');
		}
	});
	
	
	
	
	
}
