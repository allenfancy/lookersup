module.exports = function ( app ) {
    app.get('/logout', function(req, res){
        req.session.user = null;
        req.session.name = null;
        res.redirect('/home');
    });
}