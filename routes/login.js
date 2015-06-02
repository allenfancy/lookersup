var User = require('../models/user');
var crypto = require('crypto');

module.exports = function ( app ) {
    app.get('/login',function(req,res){
        res.render('login',{title:'登录'});
    });
    
    app.post('/login',function(req,res){
    	var uname = req.body.uname;
    	var password = req.body.upwd ;
		
		
		//生成密码 md5 值
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.upwd).digest('hex');
    	
		console.log('登陆测试：'+User+'User');
    	User.findOne({name:uname},function(error,doc){
    		console.log('doc....'+doc);
    		if(error){
    			console.log(error);
    			req.session.error = '网络异常';
    			return res.send(500);
    		}else if(!doc){
    			console.log('用户名不存在吗  。。。。。。。');
    			req.session.error = '用户名不存在';
    			return res.send(500);
    		}else{
    			if(password!= doc.password){
    				req.session.error = '密码错误';
    				return res.send(500);
    			}else{
    				console.log('DOC....'+doc);
    				req.session.user = doc;
    				//res.redirect('/home');
    				return res.send(200);
    			}
    		}
    	});
    });
    
}