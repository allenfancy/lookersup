var User = require('../models/user');
var crypto = require('crypto');


module.exports = function(app){
	
	//注册，get的方法，用于点击一个链接
	app.get('/register',function(req,res){
		res.render('register',{
			title:'注册'
		});
	});
	
	
	//点击按钮进行注册
	app.post('/register',function(req,res){
		console.log('come into register......');
		var uname = req.body.uname;
		var password = req.body.upwd;
		console.log(uname+"   "+password);
		
		//生成密码 md5 值
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.upwd).digest('hex');
		console.log(uname+"   "+password);
		var newUser = new User({
			name:req.body.uname,
			password:password,
			nickname:req.body.nickname,
			login_account_type:'reg'
		});
		
		User.findOne({name:uname},function(err,doc){
			console.log('this is name: '+uname);
			if(err){
			    req.session.error = "网络异常！";
				req.flash('error','网络异常')
				console.log(err);
				return res.send(500);
			}else if(doc){
				req.session.error = "用户名已经存在";
				return res.send(500);
			}else{
				User.create(newUser,function(err,doc){
					if(err){
						console.log(err);
						return res.redirect('/register');
					}else{
						console.log('come into to create user');
						req.session.error = '用户创建成功';
						res.send(200);//登录界面
					}
				});
			}
		});
	});
}