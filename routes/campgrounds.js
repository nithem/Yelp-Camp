var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")
router.get("/",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campground/campgrounds",{campgrounds:allCampgrounds,cureentUser:req.user});
        }
    });
});
//create new campground
router.post("/",isLoggedIn,function(req,res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    var newCampground = {name:name,price:price,image:image,description:description,author:author}
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log("newlyCreated");
            res.redirect("campgrounds");
        }
    });
});
router.get("/new",isLoggedIn,function(req,res){
    res.render("campground/new");
});
router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
            res.render("campground/show",{campground: foundCampground});
        }
    });
});
//Edit campground route
router.get("/:id/edit",checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campground/edit",{campground:foundCampground});
    });
});
//Update campground route
router.put("/:id",checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
});
//delte routes
router.delete("/:id",checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    }); 
});
//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    {
        return next();
    }
    req.flash("error","Please logged in");
    res.redirect("/login");
}
function checkCampgroundOwnership(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                req.flash("error","Campground not found");
                res.redirect("back");
            } else {
                //does user own campground
                if(foundCampground.author.id.equals(req.user._id )){
                    next();
                } else {
                    req.flash("error","You don't have permisiion to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","You need to be logged in");
        res.redirect("back");
    }
}

module.exports = router;
