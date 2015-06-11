var Travelnotes = require('../models/travelnotes');
var Statistics = require('../models/statistics');
var markdown = require('markdown').markdown;
var fs = require('fs');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick : true });
var moment = require('moment');

/***
 * 首先 在ubuntu 上面安装  sudo apt-get install imagemagick
 * 
 */
module.exports = function(app) {

	var i = 0;
	//定义一个UUID,这个函数去给上传的图片重命名
	function uuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        var uuid = s.join("");
        return uuid;
    }
	
	function timeFormat(date){
		return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
	      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
	}
	
	
	
	//上传图片的GET
	app.get('/user/upload',function(req,res){
		console.log('I am come into the '+(i++));
		console.log('imageUrl:'+req.flash('imageUrl'));
		res.render('upload',{
			imageUrl:req.flash('imageUrl').toString()
		});
	})
	
	//上传图片的POST
	app.post('/user/upload', function(req, res){  
		console.log('wo jinglai l ');
	    if (req.files && req.files.codecsv != 'undifined') {  
	    	var image_name = uuid();
	    	//var actual_name = req.files.codecsv.name;
	    	//actual_name.substring(actual_name.lastIndexOf('.'));
	    	res.header('Content-Type', 'text/plain');
	    	var path = req.files.codecsv.path;	//获取用户上传过来的文件的当前路径
	    	var sz = req.files.codecsv.size;
	    	console.log(path);
	    	console.log(sz);

	    	if (sz > 2*1024*1024) {
	    		console.log('come into 1');
	    		fs.unlink(path, function() {	//fs.unlink 删除用户上传的文件
	    			res.end('1');
	    		});
	    	}else {
	    		console.log('come into 3,4');
	    		var target_path='./public/images/title/'+image_name+req.files.codecsv.name;
	    		var show_path = '/images/title/'+image_name+req.files.codecsv.name;
	    		imageMagick(path)
	    		.resize(160, 120, '!') //加('!')强行把图片缩放成对应尺寸150*150！
	    		.autoOrient()
	    		.write(target_path, function(err){
	    			if (err) {
	    				console.log(err);
	    				res.end();
	    			}else{
	    				//req.flash('imageUrl',show_path);
	    				res.status(200).send({"data":show_path});
	    			}
	    			fs.unlink(path, function() {
	    				return res.end('3');
	    			});
	    		});
	    	}  	
	    }   
	  
	});
	
	
	
	app.get('/404', function(req, res) {
		res.render('404', {

		});
	});

	// 跳入到用户中心
	app.get('/user/userHome', function(req, res) {
		console.log('现在我要去用户中心了');
		if (req.session.user) {
			Travelnotes.find({"creator_id":req.session.user._id}, null, {
				limit : 10,
				sort : {
					update_time : -1
				}
			}, function(err, docs) {
			
				res.render('userhome', {
					title : '用户中心',
					user : req.session.user,
					travelnotes : docs
				});
			});
		} else {
			req.session.error = "用戶登陸信息已經過期，請重新登陸";
			res.redirect('/login');
		}
	});
	
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
			 var date = doc.create_time;
			 var time1 = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
		      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
			 console.log('time1 : '+time1);
			 doc.create_time =  time1;
			 time1 = doc.create_time;
			 console.log('time111 : '+time1);
			console.log(doc.create_time);
			console.log(doc);
			res.render('showDetail',{
				title:doc.title+'詳情',
				travelnote:doc,
				comments:doc.comments
			});
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
