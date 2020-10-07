var express = require("express");
var router = express.Router();
var passport = require("passport");

//models require

var User = require("../models/user.js");
var Subject = require("../models/subject.js");

//root
router.get("/", function(req, res) {
    
    var xx=req.flash("error");
    //console.log("xx",xx);
    res.render("home.ejs",{error1:xx});
})

router.get("/home2", function(req, res) {
    res.render("home2.ejs",{error1:req.flash("error")[0]});
})

//login


router.post("/user/login/", passport.authenticate("local", {
    successRedirect:"/user/dashboard/",
    failureRedirect: "/",
    failureFlash: true
}));

//logout

router.get("/user/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

//signup
//new
router.get("/signup", function(req, res) {
    res.render("user/signup");
});
//create
router.post("/user/signup/", function(req, res) {
    var user1 = {
        name: req.body.name,
        username: req.body.username,
    };

    console.log("user1= ", user1)

    User.register(user1, req.body.password,
        function(err, user) {
            if (err) {
                //console.log(err);
                req.flash("error",err.message);
                res.redirect("/");
            } else {
                passport.authenticate("local")(req, res, function() {
                    res.redirect("/user/dashboard/");
                });
            }
        });

})

//logout
router.get("/user/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

isloggedin
 function isloggedin(req, res, next) {    
    if (req.isAuthenticated())
        next();
    else {
         req.flash("error","Session out... Re-login in...!");
        res.redirect("/");
    }
}





module.exports = router;