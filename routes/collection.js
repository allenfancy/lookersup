var Travelnotes = require('../models/travelnotes');
var Collections = require('../models/collection');

module.exports = function(app) {

	app.post('/saveCollections', function(req,res) {
		console.log('进来了,我现在准备提收藏了');
		var travelnotes_id = req.body.travelnotes_id;
		var collection_user_id = req.body.collection_user_id;
		
		var newCollection = new Collections({
			travelnotes_id : travelnotes_id,
			collection_user_id : collection_user_id,
		});
		
		var query = {'travelnotes_id':travelnotes_id,'collection_user_id':collection_user_id};
		Collections.findOne(query,function(err,doc){
			//如果存在
			if(doc){
				res.status(500).send({'msg':'你已经表示过喜欢了'});
			}else{//如果不存在
				Collections.create(newCollection,function(err,doc){
					if(err){
						res.status(500).send({'msg':'系统后台出现错误'});
					}else{
						console.log('创建一条表示喜欢的内容成功!');
					}
				});
				var update = {
						$inc : {
							"collection_number" : 1
						}
				}
				Travelnotes.findOneAndUpdate({
					"_id":req.body.travelnotes_id
				},update,function(err,doc){
					console.log('修改表示收藏的次数:'+doc);
					if(err){
						res.status(500).send({'msg':'网络出现问题'});;
					}else{
						console.log(doc.praise_number);
						res.status(200).send({'collection_number':doc.collection_number});
					}
				});
			}
		});
		
});
}