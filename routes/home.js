var Travelnotes = require('../models/travelnotes');
module.exports = function(app) {
	console.log('come into home page');
	
	app.get('/', function(req, res){
		Travelnotes.find({}, null, {
			limit : 10,
			sort : {
				update_time : -1
			}
		}, function(err, docs) {
			console.log(docs.length);
			res.render('home', {
				title : '主页',
				user : req.session.user,
				travelnotes : docs,
				
			});
		});
		
	});
	
	//用户发布游记
	app.get('/user/publishTravelnotes',function(req,res){
		if(req.session.user){
			console.log('session ');
			res.render('publishTravelnotes',{
				title:'发布游记',
				user:req.session.user,
				imageUrl:null
			});
		}else{
			res.redirect('/home');
		}
		
	});
};