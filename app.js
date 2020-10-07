var express= require("express"),
    mongoose= require("mongoose"),
    bodyParser=require("body-parser"),
    passport=require("passport"),
    localStrategy=require("passport-local"),
    path = require("path"),
    flash = require("connect-flash"),
    connectDB = require("./DB/connection");

var app=express();
connectDB();
app.use(express.static("public"));


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
app.use(flash());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//res.locals
app.use(function(req, res, next) {
    res.locals.currUser = req.user;
    // res.locals.error=req.flash("error");
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