var Travelnotes = require('../models/travelnotes');
var Statistics = require('../models/statistics');
var markdown = require('markdown').markdown;
var fs = require('fs');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick : true });
var moment = require('moment');
var commonUtils = require('../common/commonUtils');
var ShowLike = require('../models/showlike');
/****
 * 发布游记的路由：
 * 1、发布游记
 * 2、查看游记相亲
 * 3、表示喜欢
 */
module.exports = function(app){	
	
	
	//上传图片的POST
	app.post('/user/upload', function(req, res){  
		console.log('wo jinglai l ');
	    if (req.files && req.files.codecsv != 'undifined') {  
	    	var image_name = commonUtils.uuid();
	    	console.log(image_name);
	    	res.header('Content-Type', 'text/plain');
	    	var path = req.files.codecsv.path;	//获取用户上传过来的文件的当前路径
	    	var sz = req.files.codecsv.size;
	    	if (sz > 2*1024*1024) {
	    		fs.unlink(path, function() {	//fs.unlink 删除用户上传的文件
	    			res.end('1');
	    		});
	    	}else {
	    		var target_path='./public/images/title/'+image_name+req.files.codecsv.name;
	    		var show_path = '/images/title/'+image_name+req.files.codecsv.name;
	    		imageMagick(path)
	    		.resize(160, 120, '!') //加('!')强行把图片缩放成对应尺寸150*150！
	    		.autoOrient()
	    		.write(target_path, function(err){
	    			if (err) {
	    				console.log(err);
	    				res.end();
	    			}else{
	    				res.status(200).send({"data":show_path});
	    			}
	    			fs.unlink(path, function() {
	    				return res.end('3');
	    			});
	    		});
	    	}  	
	    }   
	  
	});
	
	
	
	//查看詳情
	app.get('/showDetail/:id',function(req,res){
		console.log('id.......:'+req.params.id)
		Travelnotes.findOne({'_id':req.params.id},function(err,doc){
			if(doc){
				Travelnotes.update({'_id':req.params.id},{
					 $inc: {"browser_number": 1}
				},function(err){
					if(err){
						console.log(err);
					}
				});
			}
			//res.setHeader("Set-Cookie", [ "sid="+req.params.id]);
			res.render('showDetail',{
				title:doc.title+'詳情',
				travelnote:doc,
				comments:doc.comments
			});
		});
	});

	
	//表示喜欢
	app.post('/likeNotes',function(req,res){
		var travelnotes_id = req.body.ids;
		var showlike_user_id = req.body.showLike_id;
		var showLike = new ShowLike({
			travelnotes_id:travelnotes_id,
			showlike_user_id:showlike_user_id
		});
		var query = {'travelnotes_id':travelnotes_id,'showlike_user_id':showlike_user_id};
		ShowLike.findOne(query,function(err,doc){
			//如果存在
			if(doc){
				res.status(500).send({'msg':'你已经表示过喜欢了'});
			}else{//如果不存在
				ShowLike.create(showLike,function(err,doc){
					if(err){
						res.status(500).send({'msg':'系统后台出现错误'});
					}else{
						console.log('创建一条表示喜欢的内容成功!');
					}
				});
				var update = {
						$inc : {
							"praise_number" : 1
						}
				}
				Travelnotes.findOneAndUpdate({
					"_id":req.body.ids
				},update,function(err,doc){
					console.log('修改表示喜欢的次数:'+doc);
					if(err){
						res.status(500).send({'msg':'网络出现问题'});;
					}else{
						console.log(doc.praise_number);
						res.status(200).send({'praise_number':doc.praise_number});
					}
				});
			}
		});
		
});
		
		
	// 发布日记
	app.post('/user/saveTravelNotes', function(req, res) {
		console.log('进来了 ，来发布日记了');   
		if (req.session.user) {
			
			var travelnotes = new Travelnotes({
				title : req.body.title,
				start_province : req.body.province,
				start_city : req.body.city,
				arrive_place : req.body.arrive,
				cover_Image : req.body.converPric,
				start_time : req.body.startTime,
				end_time : req.body.endTime,
				per_spending : req.body.preSpending,
				travel_mode : req.body.travelMode,
				content : req.body.content,
				tips : req.body.tips,
				creator_id:req.session.user._id,
				creator_name:req.session.user.nickname,
				spendDays:req.body.spendDays
				
			});

			console.log(travelnotes);
			Travelnotes.create(travelnotes, function(err, doc) {
				if (err) {
					console.log(err);
					return res.redirect('/404');
				} else {
					console.log('添加成功');
					console.log(req.session.user);
					res.sendStatus(200);
					//res.redirect('/user/userHome');
				}
			});
		} else {
			req.session.error = "用戶登陸信息已經過期，請重新登陸";
			res.redirect('/login');
		}
	});
	
}