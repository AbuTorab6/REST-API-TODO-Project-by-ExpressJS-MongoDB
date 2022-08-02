const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name:{type:String},
    email:{type:String,unique:true},
    password:{type:String},
    mobile:{type:String}
},{versionKey:false});

var userModel = mongoose.model('user',userSchema);

module.exports=userModel;

