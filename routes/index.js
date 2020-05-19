var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
//root routes
router.get("/",function(req,res){
    res.render("campground/landing");
});

//register page
router.get('/register',function(req,res){
    res.render("register");
});
//handle register page
router.post('/register',function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to YelpCamp" + user.username);
            res.redirect("/campgrounds");
        });
    });
});
//login
router.get('/login',function(req,res){
    res.render("login");
});
//login handleing
//app.post(login,middleware,callback)
router.post("/login",passport.authenticate("local",{
    successRedirect : "/campgrounds",
    failureRedirect : "/login"
}),function(req,res){
});
//logout route
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","You Logged Out");
    res.redirect("/campgrounds");
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
}
module.exports = router;