const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());

var userRouter = require('./routers/userRouter');
var loginRouter = require('./routers/loginRouter');
var todoRouter = require('./routers/todoRouter');

//security package 
var cors = require('cors');
var mongoSanitize = require('express-mongo-sanitize');
var helmet = require('helmet');
var hpp = require('hpp');
var xssClean = require('xss-clean');
var  rateLimit = require('express-rate-limit');


app.use(cors());
app.use(mongoSanitize());
app.use(helmet());
app.use(hpp());
app.use(xssClean());
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, 
	legacyHeaders: false, 
})
app.use(limiter)





//Routing
app.use('/',userRouter)
app.use('/',loginRouter)
app.use('/',todoRouter)

app.use('*',(req,res)=>{
    res.status(404);
    res.send("Sorry! Wrong url");
})




//mongoDB connection
var URI = 'mongodb://localhost:27017/Todo';
var OPTION = {
    user:'',
    pass:'',
    autoIndex:true
}

mongoose.connect(URI,OPTION,{useNewUrlParser:true,useUnifiedTopology:true}).then
(
    (res)=>
    {
        console.log("connection established")
    }
).catch
(
    (err)=>{
        console.log("connection failed");
    }
)


app.listen(3000);