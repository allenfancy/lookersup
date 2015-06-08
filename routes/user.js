var Travelnotes = require('../models/travelnotes');
var markdown = require('markdown').markdown;
var fs = require('fs');
var gm = require('gm');
var imageMagick = gm.subClass({ imageMagick : true });

/***
 * 首先 在ubuntu 上面安装 sudo apt-get install imagemagick
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
	  
	app.get('/user/upload',function(req,res){
		console.log('I am come into the '+(i++));
		console.log('imageUrl:'+req.flash('imageUrl'));
		res.render('upload',{
			imageUrl:req.flash('imageUrl').toString()
		});
	})
	
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
	    	} /*else if (req.files.codecsv.type.split('/')[0] != 'image') {
	    		console.log('come into 1');
	    		fs.unlink(path, function() {
	    			res.end('2');
	    		});
	    	} */else {
	    		console.log('come into 3,4');
	    		var target_path='./public/images/title/'+image_name+req.files.codecsv.name;
	    		var show_path = '/images/title/'+image_name+req.files.codecsv.name;
	    		imageMagick(path)
	    		.resize(150, 150, '!') //加('!')强行把图片缩放成对应尺寸150*150！
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
	    	
	    	
	    	
	    	
	       /* var temp_path = req.files.codecsv.path;  
	        console.log(req.files.codecsv);
	        console.log('temp dir: '+temp_path);
	        var target_path = './public/images/title/'+req.files.codecsv.name;
	        
	        console.log(target_path);
	        if (temp_path) {  
	            fs.rename(temp_path,target_path, function(err) {  
	            	var show_url = "/images/title/"+req.files.codecsv.name;
	            	if(err){
	            		console.log(err);
	            	}else{
	            		 console.log('this is ni s  ::'+target_path);
	            		 req.flash('imageUrl',show_url);
	            		// res.send(200,{"data":show_url});
	            		 res.status(200).send({"data":show_url});
	            		 //res.redirect('/user/upload');
	            	}
	               
	            });  
	         
	        } */
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
				// console.log(docs.length());
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
			console.log(doc);
			//doc.content = markdown.toHTML(doc.content);
			console.log('這是content:'+doc.content);
			res.render('showDetail',{
				title:doc.title+'詳情',
				travelnote:doc
			});
		});
	});

	// 发布日记
	app.post('/user/saveTravelNotes', function(req, res) {
		console.log('进来了 ，来发布日记了');   
		if (req.session.user) {
			console.log(req.session.user._id);
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
				creator_id:req.session.user._id
			});

			console.log(travelnotes);
			Travelnotes.create(travelnotes, function(err, doc) {
				if (err) {
					console.log(err);
					return res.send(500);
				} else {
					console.log('添加成功');
					console.log(req.session.user);
					req.session.error = "游记发布成功!";
					res.send(200)
				}

			});
		} else {
			req.session.error = "用戶登陸信息已經過期，請重新登陸";
			res.redirect('/login');
		}
	});

	
	app.post('/upload_conver',function(req,res){
		console.log('进来了，我是来上床封面的');
	})
}