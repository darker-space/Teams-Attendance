var mongoose = require("mongoose");
var subjectSchema = require("./subjectSchema.js");

var plm = require("passport-local-mongoose");


var userSchema = mongoose.Schema({
    name: String,
    username: String, //email
    password: String,
    sub: [subjectSchema]

})

userSchema.plugin(plm);
module.exports = mongoose.model("User", userSchema);
