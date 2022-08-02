const mongoose = require('mongoose');

var todoSchema = mongoose.Schema({
    userName:{type:String},
    subject:{type:String},
    status:{type:String,default:"New"},
    date:{type:Date,default:Date.now}
},{versionKey:false});

var todoModel = mongoose.model('todo',todoSchema);

module.exports=todoModel;
