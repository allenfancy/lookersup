var Travelnotes = require('../models/travelnotes');
var markdown = require('markdown').markdown;
var fs = require('fs');
module.exports = function(app) {

	var i = 0;
	  
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
	        var temp_path = req.files.codecsv.path;  
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
	         
	        } 
	    }  
	   
	    /*res.session.url = target_path;*/
	  
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