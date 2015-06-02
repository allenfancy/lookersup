module.exports = function(app) {
	console.log('come into home page');
	app.get('/home', function(req, res) {
		//console.log('session.user.name ：　'+req.session.user.name);
		res.render('home', {
			title : '主页',
			user:req.session.user
		});
	});
	
	
	
	
};