const express = require('express');
const app = express();
app.use(express.json());
var userModel = require('../models/userModel')
var jwt = require('jsonwebtoken');

var router = express.Router();

var loginUser= async(req,res)=>
{
    var dataFromPostman = req.body;
    var result = await userModel.find({email:dataFromPostman.email});
     
    if(result[0]==undefined)
    {
        res.status(400);
        res.send("envalid email")
    }
    else
    {
        if(dataFromPostman.password===result[0].password)
        {
            try{
                var token = jwt.sign({exp:Math.floor(Date.now()/1000)+(60*60),data:{name:result[0].name,email:result[0].email,mobile:result[0].mobile}},"1234567");

                res.status(200);
                res.send(token);
            }
            catch(ob)
            {
                res.status(400);
                res.status(ob.message);
            }
        }
        else
        {
            res.status(400);
            res.send("invalid passsword");
        }
    }
}



router.route('/login')
    .post(loginUser);


    module.exports=router;