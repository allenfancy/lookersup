//express
var express = require('express');
//http请求
var http = require('http');
//路径
var path = require('path');
//视图
var ejs = require('ejs');

var multer = require('multer');

var session = require('express-session');

var bodyParser = require('body-parser');
// 图标
var favicon = require('serve-favicon');
//
var cookieParser = require('cookie-parser');
//
var flash = require('connect-flash');
// 文件
var fs = require('fs');
// 日志
var logger = require('morgan');
//
var Travelnotes = require('./models/travelnotes');
//富文本编辑
var ueditor = require("ueditor");
//授权
var passport = require("passport");

var app = express();
//mongodb
var mongodb = require('./common/db.js');
//获取config配置
var config = require('./common/config');

// 设置端口
app.set('port', process.env.PORT || 3000);

//设定views变量，意思是视图存放的目录
app.set('views',path.join(__dirname,'views'));

//设定views变量，意为网页模板引擎
app.set('view engine','html');
app.engine('.html',require('ejs').__express);


// 存放静态文件目录，比如本地文件
app.use(express.static(path.join(__dirname, 'public')));
//设置图标
app.use(favicon(__dirname + '/public/images/favicon.ico'));
//
app.use(bodyParser());
//app.use(express.methodOverride());
app.use(passport.initialize());
app.use(passport.session());

//数据库连接
mongodb.connect(function(err){
	if(err){
		console.log(err);
		throw err;
	}
});

app.on('colse',function(err){
	mongodb.disconnect(function(err){
		if(err){
			console.log(err);
			throw err;
		}
	})
});

//使用cookie
app.use(cookieParser());
//使用session
app.use(session({
	secret:config.session_secret,
	key:config.email,
	cookie:{maxAge:1000*60*60*24*30}//30day
}));
//使用flash
app.use(flash());
app.use(function(req,res,next){
	res.locals.user = req.session.user;
	var err = req.session.error;
	res.locals.message = '';
	if(err){
		res.locals.message =  '<div class="alert alert-danger" style="margin-bottom: 20px;color:red;">' + err + '</div>';
	}
	next();
});

//图片的上传路径
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {
    // ueditor 客户发起上传图片请求
   // console.log('ueditor 客户发起上传图片请求:'+req.query.action);
    if (req.query.action === 'uploadimage') {

        var foo = req.ueditor;

        //console.log(foo);
        var imgname = req.ueditor.filename;

        console.log('imgname:'+imgname);
        var img_url = '/images/ueditor/' ;
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/images/ueditor/';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/nodejs/config.json');
    }
}));

// 日志信息
var accessLog = fs.createWriteStream('access.log', {
	flags : 'a'
});

//错误日志信息
var errorLog = fs.createWriteStream('error.log', {
	flags : 'a'
});

// 日志
app.use(logger({
	stream : accessLog
}));

// multer
app.use(multer({
	dest : './public/images',
	rename : function(fieldname, filename) {
		return filename;
	}
}));

// 错误信息
app.use(function(err, req, res, next) {
	var meta = '[' + new Date() + '] ' + req.url + '\n';
	errorLog.write(meta + err.stack + '\n');
	next();
});

require('./routes')(app);

app.get('/', function(req, res) {
	console.log('come into home page ....');
	var sessionUser = req.session.user;
	console.log('user :  '+ sessionUser);
	if (!sessionUser || sessionUser=='undefined') {
		//console.log('user is not exist');
		var sid = req.cookies.sid;
		//console.log(sid);
		if (!sid || sid =='undefined') {
			//console.log('come into sid undefined');
			res.setHeader("Set-Cookie", [ "sid="
					+ Math.floor(Math.random() * 10000) ]);
			Travelnotes.find({}, null, {
				limit : 10,
				sort : {
					update_time : -1
				}
			}, function(err, docs) {
				//console.log('query docs:'+docs)
				res.render('home', {
					title : '主页',
					user : req.session.user,
					travelnotes : docs
				});
			});
		}else{
			Travelnotes.find({}, null, {
				limit : 10,
				sort : {
					update_time : -1
				}
			}, function(err, docs) {
				res.render('home', {
					title : '主页',
					user : req.session.user,
					travelnotes : docs
				});
			});
		}
	} else {
		//console.log('user login');
		res.setHeader("Set-Cookie", [ "sid="
		          					+ Math.floor(Math.random() * 10000) ]);
		Travelnotes.find({}, null, {
			limit : 10,
			sort : {
				update_time : -1
			}
		}, function(err, docs) {
			res.render('home', {
				title : '主页',
				user : req.session.user,
				travelnotes : docs
			});
		});
	}
});

// 端口
http.createServer(app).listen(app.get('port'), function(req,res) {
	console.log('lookersup server listening on port : ' + app.get('port'));
});