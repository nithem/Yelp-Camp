var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground")
var Comment = require("../models/comment")

//create new comment
router.get("/newcm",isLoggedIn,function(req,res){
    console.log(req.params.id);
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        } else {
            res.render("comment/newcm",{campground: campground})
        }
    })
});
//add new comment post
router.post("/",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
                if(err){
                    req.flash("error","Something Went Wrong");
                    console.log(err);
                } else {
                    Comment.create(req.body.comment,function(err,comment){
                        if(err){
                            console.log(err);
                        } else {
                            //addd usrname and id to comment
                            comment.author.id =  req.user._id;
                            comment.author.username = req.user.username;
                            //save comment
                            comment.save();
                            campground.comments.push(comment);
                            campground.save();
                            console.log(comment);
                            req.flash("success","Success fully added comment");
                            res.redirect('/campgrounds/' + campground._id );
                        }
                    })
                }
    })
});
//EDIT ROUTE COMMENT
router.get("/:comment_id/edit",checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comment/edit",{campground_id : req.params.id,comment : foundComment});
        }
    });
});
//UPDATE COMMENT ROUTE
router.put("/:comment_id",checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
//DELETE COMMENT
router.delete("/:comment_id",checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success","Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
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
function checkCommentOwnership(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                req.flash("error","Comment not found");
                res.redirect("back");
            } else {
                //does user own campground
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error","You have not permission to do that");
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