var Travelnotes = require('../models/travelnotes');
var Statistics = require('../models/statistics');
var markdown = require('markdown').markdown;
var fs = require('fs');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick : true });
var moment = require('moment');

module.exports = function(app){

//查看詳情
	app.get('/showDetail/:id',function(req,res){
		console.log('come into showDetails');
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
			res.render('showDetail',{
				title:doc.title+'詳情',
				travelnote:doc,
				comments:doc.comments
			});
		});
	});

	
	//表示喜欢
	app.post('/likeNotes',function(req,res){
		var update = {
				$inc : {
					"praise_number" : 1
				}
		}
		Travelnotes.findOneAndUpdate({
			"_id":req.body.ids
		},update,function(err,doc){
			if(err){
				res.status(500).send({'msg':'网络出现问题'});;
			}else{
				console.log(doc.praise_number);
				console.log(req.body.sid);
				res.setHeader("Set-Cookie", [ "newsid="+req.body.sid]);
				res.status(200).send({'praise_number':doc.praise_number});
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