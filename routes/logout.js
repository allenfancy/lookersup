/***
 * 退出功能：
 * 清空session 以及其他的信息
 */
module.exports = function ( app ) {
    app.get('/logout', function(req, res){
        req.session.user = null;
        req.session.error = null;
        res.redirect('/');
    });
}