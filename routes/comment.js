var Travelnotes = require('../models/travelnotes');
var Comment = require('../models/comment');

module.exports = function(app) {

	// 每当评论一次后,就把评论的信息添加到对应的游记中去
	app.post('/saveComment', function(req, res) {
		console.log('进来了,我现在准备提交评论了');
		if (req.session.user) {
			var comment = new Comment({
				comment_user_id : req.session.user._id,
				comment_user_nickname : req.session.user.nickname,
				comment_content : req.body.content
			});
			console.log(comment);
			var update = {
				$push : {
					"comments" : comment
				},
				$inc : {
					"comment_number" : 1
				}
			};
			console.log(update);

			Travelnotes.findOneAndUpdate({
				"_id" : req.body.ids
			}, update, function(err) {
				if (err) {
					console.log('some error is eccoured!');
					console.log(err);
				} else {
					console.log('状态修改成功');
					res.send(200);
				}
			});

		} else {
			res.status(500).send({
				'msg' : '请先登录'
			});
		}
	});
}