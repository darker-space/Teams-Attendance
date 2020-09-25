var express = require("express");
var router = express.Router();
var passport = require("passport");
var fs=require("fs");
var mongoose=require("mongoose");
var multer=require("multer");

//models require

var User = require("../models/user.js");
var Subject = require("../models/subject.js");
var dateSchema=require("../models/dateSchema.js")
var Date1=mongoose.model("Data1",dateSchema);

//delete from nodejs 
var fs = require('fs');

//storage

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log("hello..1");
            cb(null, "uploads/");
    },
    filename: function(req, file, cb) {
        console.log("hello..2");
        
        cb(null, Date.now() + file.originalname);
    }
})

//filefilter

var filefilter = function(req, file, cb) {
        if (file.mimetype === "application/octet-stream") {
        console.log("hello..3");
            
            cb(null, true);
        } else {
        console.log("hello..4");
            console.log(file.mimetype);
            
            cb(null, false);
        }
}

var upload = multer({ storage: storage, fileFilter: filefilter });

//post


router.post("/attendence/:id", isloggedin, upload.single("attendence_file"), function(req, res) {


    console.log("yo!! ");
    var uploaded = req.file;
    var path1=uploaded.path;
    var timing =req.body.timing;
    var date1=req.body.date1;
    var start=req.body.start;
    var subject=req.params.id;
    
    var moment=require('moment');
    
    var cc=new Date(date1+","+start);
    var dd=moment(cc).add(60, 'minutes');
    
    console.log(uploaded);
    console.log(req.body);
        
        
     var fs = require('fs'); 
    const csv = require('csv-parser');

    var csvData=[];
    var totaltime=new Map();
    var firsttime=new Map();
    var last=new Map();
    
    var nameSet=new Set();

    fs.createReadStream('.\\'+path1,'utf16le')
        .pipe(csv({delimiter: " ",separator:"\t"}))
        .on('data', function(csvrow) {
            //console.log(csvrow);
            var name=Object.keys(csvrow)[0];
            csvrow["Full Name"]=csvrow[name];
            delete csvrow[name];
            csvData.push(csvrow);      
        })
        .on('end',function() {
        //do something with csvData
            //done extracting now delete file
        fs.unlink(".\\"+path1, function (err) {
            if (err)  {
                console.log(err);
                //res.redirect("back");
            }
            else{
            console.log('File deleted!')
            //res.redirect("back");
            };
        }); 
        //console.log(csvData);
        
        var sizee=Object.keys(csvData[0]).length;
        //console.log("length is ...........", sizee);
        if(sizee!=3 ||(!csvData[0]["Full Name"])||(!csvData[0]["Timestamp"])||(!csvData[0]["User Action"]))
        {
            res.send("Invalid .csv file...please Check...! ");
        }
        
         //main task
         csvData.forEach(function(row){
            // console.log(row);
             nameSet.add(row["Full Name"]);
             if(row["User Action"].charAt(0)=='J')
             {
                 //console.log("option1 ");
                 firsttime.set(row["Full Name"],row["Timestamp"]);
                 last.set(row["Full Name"],"J");
             }
             else{
                //console.log("option2 ");
                if(!totaltime.has(row["Full Name"]))
                {
                    totaltime.set(row["Full Name"],0);
                }
                var time1=parseInt(totaltime.get(row["Full Name"]));
                
                var xcx=firsttime.get(row["Full Name"]);
                var aa = new Date(xcx);
                var bb = new Date(row["Timestamp"]);
                time1=time1+moment(bb).diff(moment(aa), 'minutes');
                totaltime.set(row["Full Name"],time1);
                
                last.set(row["Full Name"],"R");
             }
         })
         
         //last update
         
         var finalname=[];
         //console.log(nameSet);
        for(let name1 of nameSet)
        {
            //console.log("##",name1);
            if(!totaltime.has(name1))
                {
                    totaltime.set(name1,0);
                }
            var time1=parseInt(totaltime.get(name1));
            if(last.get(name1)=="J")
            {
                var aa = new Date(firsttime.get(name1));
                time1=time1+moment(dd).diff(moment(aa), 'minutes');
            }
            if(time1>=parseInt(timing))
            {
                finalname.push(name1);
            }
        }
        
         console.log(finalname);
         var aDate=date1+","+start;
         
         var datelist1=new Date1({
            date: aDate,
            students: finalname,
            timing:timing,
            attendence:finalname.length
         });
         
         console.log(datelist1);
    
         
         User.findById(req.user._id,function(err,curr_user){
            if(err)
            {
                res.redirect("back");
            }
            else{
                var subi=-1;
               // console.log("$$$$$");
                for(var i=0;i<curr_user.sub.length;i++)
                {
                    if(curr_user.sub[i]._id.equals(subject))
                    {
                        subi=i;
                        break;
                    }
                }
                //console.log("$$$$$");
                
                if(subi==-1){
                    console.log("subject not found...");
                    res.redirect("back");   
                }
                // curr_user.sub[subi].dates
                
                //console.log("$$$$$");
                var key=-1;
                for(var j=0;j< curr_user.sub[subi].dates.length;j++)
                {
                    if(curr_user.sub[subi].dates[j].date==aDate)
                    {
                        key=j;
                        break;
                    }
                }
                //console.log("$$$$$");
                if(key!=-1)
                {
                   // console.log("$$$$$");
                    for(var i=0;i<curr_user.sub[subi].dates[key].students.length;i++)
                    {
                        //console.log("#");
                        var xx=parseInt(curr_user.sub[subi].students.get(curr_user.sub[subi].dates[key].students[i]));
                        curr_user.sub[subi].students.set(curr_user.sub[subi].dates[key].students[i],xx-1);
                        
                    }
                    //console.log("$$$$$");        
                   
                    curr_user.sub[subi].dates[key]=datelist1;
                    //console.log("$$$$$");
                    
                }
                else{
                   // console.log("********$$$$$");
                    curr_user.sub[subi].dates.push(datelist1);
                }
               // console.log("$$$$$");
               for(var k=0;k<finalname.length;k++)
               {
                   if(!curr_user.sub[subi].students.has(finalname[k]))
                   {
                    curr_user.sub[subi].students.set(finalname[k],0);
                   }
                var xx=parseInt(curr_user.sub[subi].students.get(finalname[k]));
                curr_user.sub[subi].students.set(finalname[k],xx+1);
               }
         
               console.log("##yoyoyoyoyoyoyo");
         
               curr_user.save(function(err,user11){
                if(err)
                {
                    console.log(err);
                    res.redirect("back");
                }
                else
                {
                  res.redirect("back");
                }
            });
         }
        });
        
     
        
        })
        .on('error', console.log);
 
})



//delete date

router.get("/date/delete/:subid/:dateid",isloggedin,function(req,res){
    var subid=req.params.subid;
    var dateid=req.params.dateid;
    
    User.findById(req.user._id,function(err,user1){
        if(err)
        {
            res.redirect("back");
        }
        else{
                      
            var jj;
            
            for(var i=0;i<user1.sub.length;i++)
            {
                if(user1.sub[i]._id.equals(subid))
                {
                    jj=i; break;
                }
            }
 
            var key;
            
            for(var i=0;i<user1.sub[jj].dates.length;i++)
            {
                if(user1.sub[jj].dates[i]._id.equals(dateid))
                {
                    key=i; break;
                }
            }
            
            for(var i=0;i<user1.sub[jj].dates[key].students.length;i++)
                    {
                        //console.log("#");
                        var xx=parseInt(user1.sub[jj].students.get(user1.sub[jj].dates[key].students[i]));
                        user1.sub[jj].students.set(user1.sub[jj].dates[key].students[i],xx-1);
                        
                    }
                    
                    
          var filtered=user1.sub[jj].dates.filter( function is( value ) { 
                var key3=0; 
                if(value._id.equals(dateid))
                {
                   key3=1;
                }
                return key3==0;  
            } );  
            
            console.log(user1.sub.length);
           delete user1.sub[jj].dates;
           user1.sub[jj].dates=filtered; 
           console.log(user1.sub.length);
        
          
          
          user1.save(function(err,user11){
              if(err)
              {
                res.redirect("/user/subject/"+subid);
              }
              else
              {
                res.redirect("/user/subject/"+subid);
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