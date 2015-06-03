var travelnotes = require('../models/travelnotes');


module.exports = function(app){
	
	
	//发布日记
	app.post('/user/saveTravelNotes',function(req,res){
		console.log('进来了 ，来发布日记了');
	});
	
	
	
}