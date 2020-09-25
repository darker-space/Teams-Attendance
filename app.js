var express= require("express"),
    mongoose= require("mongoose"),
    bodyParser=require("body-parser"),
    passport=require("passport"),
    localStrategy=require("passport-local"),
    path = require("path"),
    connectDB = require("./DB/connection");

var app=express();
connectDB();
app.use(express.static("public"));



// var fs = require('fs'); 
// const csv = require('csv-parser');

// var csvData=[];
// fs.createReadStream('./Data2.csv','utf16le')
//     .pipe(csv({delimiter: " ",separator:"\t"}))
//     .on('data', function(csvrow) {
        
//         var name=Object.keys(csvrow)[0];
//         csvrow["Full Name"]=csvrow[name];
//         delete csvrow[name];
//         csvData.push(csvrow);    
//     })
//     .on('end',function() {
//       //do something with csvData
//      //console.log(csvData);
//      console.log(typeof(csvData[0]));
//      console.log(csvData[0]["Timestamp"]);
//     })
//     .on('error', console.log);
    
var moment=require('moment');

//2:47:05 PM 2:44:30 PM

    
// var aa = new Date('7/22/2020, 10:46:05 AM');
// var bb = new Date('7/22/2020, 10:36:15 AM');
// console.log(aa,bb);

// var a = moment.duration(aa);
// var b = moment.duration(bb);
// console.log(typeof(moment(aa).diff(moment(bb), 'minutes')));

// var start='9:00 am';
//         var date1="2020-09-11";
//         console.log("AEhhhhhhhhhh");
//         console.log(new Date(date1+","+start));
        
// var cc=new Date(date1+","+start);
// var dd=moment(cc).add(60, 'minutes');
// console.log(moment(dd).diff(moment(cc), 'minutes'));




//models
var User = require("./models/user.js");
   


//routes require
var userRoutes = require("./routes/user.js");
var dashboardRoutes = require("./routes/dashboard.js");
var attendenceRoutes = require("./routes/attendence.js");
const { timeStamp } = require("console");


app.set("view engine", "ejs");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

//passport

app.use(require("express-session")({
    secret: "Aliens exist...ok...",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//res.locals
app.use(function(req, res, next) {
    res.locals.currUser = req.user;
    //console.log("hello i am police " + req.user);
    next();
});


//Routes
app.use(userRoutes);
app.use(dashboardRoutes);
app.use(attendenceRoutes);
  
    
app.get("/", function(req, res) {
    //res.send("hello");
    res.render("home.ejs");
})
    
    
app.listen(process.env.PORT || 3000, function() {
    console.log("Server started!......");
})