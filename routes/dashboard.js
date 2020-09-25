var express = require("express");
var router = express.Router();
var passport = require("passport");

//models require

var User = require("../models/user.js");
var Subject = require("../models/subject.js");



//dashboard

router.get("/user/dashboard/",isloggedin,function(req,res){
    res.render("dashboard",{userinfo:req.user});
});


//subject

//create
router.post("/user/subject/new",isloggedin,function(req,res,)
{
    console.log("inside sub route...");
    var map1=new Map(
        //[["Andrew G",20],["Nuin wer",30],["poew G",0],["MiuG",80],["Andrew G",20],["Andrew G",20]]
    );
    var subject1=new Subject({
        name: req.body.name,
        branch: req.body.branch,
        section: req.body.section,
        students:map1,
        subject_id: req.body.subject_id,
        year:req.body.year
    });
    
    console.log(subject1);
    User.findById(req.user._id,function(err,user1){
        if(err)
        {
            res.redirect("back");
        }
        else{
            
          user1.sub.push(subject1);
          console.log( user1.sub);
          
          user1.save(function(err,user11){
              if(err)
              {
                  res.redirect("back");
              }
              else
              {
                res.redirect("back");
              }
          });
        }
        
    })
});


//subject dashboard

router.get("/user/subject/:id",isloggedin,function(req,res){
    var subject1=req.params.id;
    res.render("subject_dashboard",{userinfo:req.user,subject:subject1});
})

//delete subject
router.get("/class/delete/:subid",isloggedin,function(req,res){
    var sub_id=req.params.subid;
    User.findById(req.user._id,function(err,user1){
        if(err)
        {
            res.redirect("back");
        }
        else{
                      
 
          var filtered=user1.sub.filter( function is( value ) { 
                var key3=0; 
                if(value._id.equals(req.params.subid))
                {
                   key3=1;
                }
                return key3==0;  
            } );  
            
            console.log(user1.sub.length);
           delete user1.sub;
           user1.sub=filtered; 
           console.log(user1.sub.length);
        
          
          
          user1.save(function(err,user11){
              if(err)
              {
                res.redirect("/user/dashboard/");
              }
              else
              {
                res.redirect("/user/dashboard/");
              }
          });
        }
        
    })

});

//isloggedin
function isloggedin(req, res, next) {
    if (req.isAuthenticated())
        next();
    else {
        res.redirect("/");
    }
}





module.exports = router;