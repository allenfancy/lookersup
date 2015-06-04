var Travelnotes = require('../models/travelnotes');


module.exports = function(app){
	
	//跳入到用户中心
/*	app.get('/user/userHome',function(req,res){
		console.log(req.session.user.name);
		res.render('userhome',{
			title:'用户中心',
			user:req.session.user
		});
	})*/
	
	//发布日记
	app.post('/user/saveTravelNotes',function(req,res){
		console.log('进来了 ，来发布日记了');
		console.log(req.body.title);
		var travelnotes = new Travelnotes({
			title:req.body.title,
			start_province:req.body.province,
			start_city:req.body.city,
			arrive_place:req.body.arrive,
			cover_Image:req.body.converPric,
			start_time:req.body.startTime,
			end_time:req.body.endTime,
			per_spending:req.body.preSpending,
			travel_mode:req.body.travelMode,
			content:req.body.content,
			tips:req.body.tips
		});
		
		console.log(travelnotes);
		Travelnotes.create(travelnotes,function(err,doc){
			if(err){
				console.log(err);
				return res.send(500);
			}else{
				console.log(req.session.user);
				req.session.error = "游记发布成功!";
				res.render('userhome',{
					title:'用户中心',
					user:req.session.user
				});
			};
			
		});
	});
	
}