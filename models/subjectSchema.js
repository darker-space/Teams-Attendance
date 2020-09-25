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
      
    total_classes:{ type: Number, default: 0 },
    
    dates_list:[String],
    dates: [dateSchema]
})
 
module.exports = subjectSchema;
