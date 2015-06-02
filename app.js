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

var app = express();

var mongodb = require('./common/db.js');

var config = require('./common/config')

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
app.use(bodyParser.urlencoded({
	extended : false
}));

console.log('come in  app.js');
console.log('this is mongoose :' +mongodb);
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



app.use(cookieParser());
app.use(session({
	secret:config.session_secret,
	key:config.email,
	cookie:{maxAge:1000*60*60*24*30}//30day
}));
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

app.get('/',function(req,res){
	res.render('login');
});

// 端口
http.createServer(app).listen(app.get('port'), function() {
	console.log('lookersup server listening on port : ' + app.get('port'));
});