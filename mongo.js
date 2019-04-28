var mongoose = require('mongoose');
var env = require('dotenv');
env.config();

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log("Connected to mongodb server");
});

// mongoose.connect(process.env.mongoConfig, {useNewUrlParser:true});
mongoose.connect('mongodb://localhost:27017/MyRentCar',{useNewUrlParser:true});