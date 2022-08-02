const express = require('express');
const app = express();
app.use(express.json());
var userModel = require('../models/userModel')
var jwt = require('jsonwebtoken');

var router = express.Router();




var insertUser = async(req,res)=>
{
    var dataFromPostman = req.body;
     var result = await userModel.find({email:dataFromPostman.email});
     
     if(result[0]==undefined)
     {
        var ob = new userModel(dataFromPostman);
        try
        {
            var data = await ob.save();
            var result2 = await userModel.find({email:dataFromPostman.email});
            var token = jwt.sign({exp:Math.floor(Date.now()/1000)+(60*60),data:{name:result2[0].name,email:result2[0].email,mobile:result2[0].mobile}},"1234567");

            res.status(200);
            res.send(token);

        }
        catch(ob)
        {
            res.status(400);
            res.send(ob.message);
        }
     }
     else
     {
        res.status(400);
        res.send("The user with this email is already exist.Please provide a new email");
     }
    
}



var viewProfile = async (req,res)=>
{
    var token = req.headers.authorization;
    if(token=='')
    {
        res.status(400);
        res.send("you did not provide any token! please provide token to view you profile");
    }
    else
    {
        try{
            var data = jwt.verify(token,'1234567');
            res.status(200);
            res.send(data.data);
        }
        catch(ob)
        {
            res.status(400);
            res.send(ob.message);
        }
    }
}

var updateProfile = async (req,res)=>
{
    var dataFromPostman = req.body;
    var token = req.headers.authorization;
    if(token=='')
    {
        res.status(400);
        res.send("you did not provide any token! please provide token to view you profile");
    }
    else
    {
        try{
            var data = jwt.verify(token,'1234567');
            var result = await userModel.find({email:data.data.email});

            if(result[0]==undefined)
            {
                res.status(400);
                res.send("can't find this user");
            }
            else
            {
                var updateStatus = await userModel.updateOne({email:data.data.email},{$set:{name:dataFromPostman.name,password:dataFromPostman.password,mobile:dataFromPostman.mobile}})
                
                if(updateStatus.modifiedCount==0)
                {
                    res.status(400);
                    res.send("can't update the info");
                }
                else
                {
                    var result2 = await userModel.find({email:data.data.email});
                    var token = jwt.sign({exp:Math.floor(Date.now()/1000)+(60*60),data:{name:result2[0].name,email:result2[0].email,mobile:result2[0].mobile}},"1234567");
                    
                    res.status(200);
                    res.send(token);
                }

            }

        }
        catch(ob)
        {
            res.status(400);
            res.send(ob.message);
        }
    }
}







router.route('/registration')
    .post(insertUser);
router.route('/profile')
    .get(viewProfile);
router.route('/update')
    .post(updateProfile);

    module.exports=router;