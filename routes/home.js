module.exports = function(app) {
	console.log('come into home page');
	
	app.get('/home', function(req, res){
		res.render('home', {
			title : '主页',
			user:req.session.user
		});
	});
	
	//用户发布游记
	app.get('/user/publishTravelnotes',function(req,res){
		if(req.session.user){
			res.render('publishTravelnotes',{
				title:'发布游记',
				user:req.session.user,
				imageUrl:null
			});
		}else{
			res.render('home',{
				title:'主页',
				user:null
			})
		}
		
	});
};