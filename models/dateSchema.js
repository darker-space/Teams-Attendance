var mongoose = require("mongoose");

var dateSchema = mongoose.Schema({
    date: String,
    timing: String,
    students: [String],
    attendence:{ type: Number, default: 0 }
})

module.exports = dateSchema;
