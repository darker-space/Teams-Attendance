var mongoose = require("mongoose");

var URI = "mongodb+srv://Aakash:aakash@aakash.suijx.mongodb.net/Aakash?retryWrites=true&w=majority";

const connectDB = async() => {
    await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("DB connected...");
}

module.exports = connectDB;