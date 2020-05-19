
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Comment = require("./models/comment");
var User = require("./models/user");
var Campground = require("./models/campground");
    seedDB = require("./seeds");
//requiring routes
var commentRoutes = require("./routes/comment"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")

mongoose.connect("mongodb://localhost/yelp_camp",{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    useFindAndModify : false
});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
seedDB();

// Campground.create(
//     {
//     name : "Salmon Creek",
//     image : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAEgASAMBIgACEQEDEQH/xAAaAAADAAMBAAAAAAAAAAAAAAAAAQUCAwQG/8QALRAAAQQBAgUCBQUBAAAAAAAAAQACAxEEITEFEhNBUSJxFDJCYfAjgZGh0VL/xAAYAQADAQEAAAAAAAAAAAAAAAAAAgMBBP/EAB8RAAIDAAIDAQEAAAAAAAAAAAABAgMRBCESEzFBIv/aAAwDAQACEQMRAD8A32i0k02i4FoQkjTcGmktr8eVmMcl7Q2ACzIXCq/OyVzjH6xlCUviNaa18KxRmPOfxFj4YWUI2jQuadQ4e476DVTOJ8VPCp3wvIyw1wAcw8pr280khdGc3BfUUsolCKkywhc8eXFJhfGMJMFWXVt9j9+yadzSJquTWpGxKwZWxA/qO+Vnc/spXwedm4hzeJ5UeFhctiOL1PI9zQs/gWEPHMOeQY2Lizxte71Sk80jht6jvXtooSuffgtw6K+OuvN5peEPNC6iTkEHpQtFudV+o/8AI0WyHFLMnGhnY6WaQXJHDqIh5c7YC1jw6RmDH0Om2GF7K6kupLtBte1bD+d1y5PGY4Yjj4s0cTLtznD1u8kityuH33SeI7nxql20W8k4MOJJUMDZNP1HnmazWtdf6H8qZxHiOJk4jDnFzMNtOY7lIfNodmjze9UNFDyuM4ePjtlEeRIQ2o3uoUdLpvc697Cjnjzn5kuRkQF87WksDpOYRmibpNDj2T7eg7Kq+ke6z+OY0eJGzC4hiY0EVDqBwkcAB8rWCzYXk8vJg4nknHx3yTGMHq5Ge4EtbX0C/wDSfsoD4o3gPe71vAPp2ad7WqOaOLJLgecfKRsa+3ldVXFUF/L7OezkOWJroo5GWyGD4GGTliF8oLvqO7nDz/iFJMxdmiVjbq67aef7Qun1uPwh7FIccrHPZ8RM5zRpep5QreFxTGja5mOx0TR9bS0SP9zvS8l1KTbMWuBaaIV7KFNYzkq5TrenqXcQDWSC3xB51JfZr3U9uVA17jGWgjXmq9VHfO55t7i4rHqBZHjpDz5rfxFM8RtzXuZzvaKDnm1ztynB7nEAucKJXH1PCXP3KoqkiDvk/wBLRyY+mxrTzytFV5K5JccRtLtSDtXZc+PO1m+6ymyw62n9vCRQafRZ2RlHZHTj5wjdrfKdzXdCmucNw434Qq+KOdzZr2StK0FOSwdpWlaVoNMrRaxtFoDB2i1jaFhplaFihaA7StCFgYFpWhCDcC0WhCwMC0rQhBoIQhAH/9k=",
//     description:"This is inform about camp",
//     comment: {
//         text: String,
//         author: String
//     }

//     },function(err,campground){
//         if(err){
//             console.log(err);
//     }else{
//              console.log("New Creating Campground");
//         console.log(campground);
//     }
// });

//Passport Configuration
app.use(require("express-session")({
    secret : "hii how are you",
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//showing users details/name
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.get("/",function(req,res){
    res.render("campground/landing");
});
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);



app.listen(2000,function(){
    console.log("Yelpcamp serevr has started");
});