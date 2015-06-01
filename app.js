var express = require('express');
var http = require('http');
var path = require('path');
var ejs = require('ejs');
var multer = require('multer');
var session = require('express-session');
var bodyParser = require('body-parser');


var app = express();

//设置端口
app.set('port',process.env.PORT || 3000);

//设置views变量
app.set('views',path.join(__dirname,'views'));

//设置views变量，以为网页模板殷勤
app.set('view engine','html');
app.engine('.html',require('ejs').__express);


//存放静态文件目录，比如本地文件
app.use(express.static(path.join(__dirname,'public')));
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());
//日志
app.use(logger({stream: accessLog}));
//multer
app.use(multer({
	  dest: './public/images',
	  rename: function (fieldname, filename) {
	    return filename;
	  }
	}));
//端口
http.createServer(app).listen(app.get('port'),function(){
	console.log('server listening on port : '+ app.get('port'));
})