/**
 * Created by Administrator on 2015/8/24.
 */
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    , GithubStrategy = require('passport-github').Strategy
    , oauthDetail = require('./oauthDetail')
    ,User = require('../models/user');


module.exports = function(app){

    passport.use(new GithubStrategy({
        clientID: "aed8d1a55e3b743ea174",
        clientSecret: "028db4db9e6bfd0adcbd77bef80963ee1758bbd2",
        callbackURL: "http://localhost:3000/auth/github/callback"
    },function(accessToken, refreshToken, profile, done) {
       // console.log(profile.id);
       // console.log(profile._json);
        done(null, profile._json);
    }));

    passport.serializeUser(function (user, done) {//保存user对象
       // console.log(user);
        done(null, user);//可以通过数据库方式操作
    });

    passport.deserializeUser(function (user, done) {//删除user对象
        done(null, user);//可以通过数据库方式操作
    });

    //app.all('/github',isLoggedIn);
    app.get('/github',function(req,res,next){
        var user  = req.flash("user")[0];
        var newUser = {
            openId:"Github_"+user.id,
            nickname:user.login,
            name:user.name,
            headIcon:user.avatar_url,
            login_account_type:"oauth"
        }

        User.findOne({openId:newUser.openId},function(err,doc){
            if(err){
                req.session.error = "网络异常！";
                req.flash('error','网络异常')
                console.log(err);
                return res.send(500);
            }else{
                if(doc){
                    req.session.user = doc;
                    console.log(doc.nickname);
                    return res.redirect('/');
                }else{
                    User.create(newUser,function(err,doc){
                       if(err){
                           req.session.error = "Oauth创建用户失败";
                           req.flash('error','Oauth创建用户失败');
                           console.log(err);
                           return res.send(500);
                       }else{
                           if(doc){
                               console.log(doc);
                               req.session.user = doc;
                               return res.redirect('/');
                           }else{
                               req.session.error = "Oauth创建用户失败";
                               req.flash('error','Oauth创建用户失败');
                               console.log(err);
                               return res.send(500);
                           }
                       }
                    });
                }
            }
        });
    });

    app.get('/auth/github',passport.authenticate("github"));

    app.get("/auth/github/callback",
        passport.authenticate("github",{
            failureRedirect: '/'
        }),function(req,res){
            req.flash("user",req.user);
            res.redirect('/github');
        });
};