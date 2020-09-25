var mongoose = require("mongoose");
var dateSchema=require("./dateSchema");

var subjectSchema = mongoose.Schema({
    name: String,
    subject_id:String,
    branch:String,
    year:String,
    section:String,

    students:{
        type: Map,
        of: Number
      },

    dates: [dateSchema]
})
 
module.exports = mongoose.model("Subject", subjectSchema);
