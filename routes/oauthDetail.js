/**
 * Created by allen.wu on 2015/8/24.
 */

exports.github = function (req, res) {
    console.log(req.user);
    var html = "<h2>你好, " + req.user.displayName +"(" + req.user.username+")</h2>" +
        "<p>blog: <a href='"+req.user.profileUrl+"'>"+req.user.profileUrl+"</a></p>" +
        "<p><a href='/logout'>退出</a></p>";
    res.send(html);
};
