var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name:"Cloud Rest",
        image: "data:image/jpeg;base64,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",
        description: "This is awesome cloud rest mountain."
    },
    {
        name:"Mountain Range",
        image: "data:image/jpeg;base64,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",
        description: "This is Mountain Range"

    }
]
// //Remove all campground
function seedDB(){
    // Campground.deleteOne({},function(err){
        // if(err){
        //     console.log(err);
        // } 
        // console.log("removed campgrounds");
        // data.forEach(function(seed){
        //     //add new campground
        //     Campground.create(seed,function(err,campground){
        //         if(err){
        //             console.log(err)
        //         } else {
        //             console.log("added a campground")
        //             //create a comment
        //             Comment.create(
        //                 {
        //                     text: "this place is great",
        //                     author:"homer"
        //                 },function(err,comment){
        //                     if(err){
        //                         console.log(err);
        //                     } else {
        //                         campground.comments.push(comment);
        //                         campground.save();
        //                         console.log("Created new comment");
        //                     }
        //                 }
        //             )


        //         }
    
        //     })
        // })
        
    // });
}    

                               
module.exports = seedDB;