const express = require('express');
const app = express();
app.use(express.json());
var todoModel = require('../models/todoModel')
var jwt = require('jsonwebtoken');

var router = express.Router();


var insertTodo = async (req,res)=>
{
    var token = req.headers.authorization;
    var dataFromPostman = req.body;
    if(token=='')
    {
        res.status(400);
        res.send("you did not provide any token! please provide token to view you profile");
    }
    else
    {
        try{
            var data = jwt.verify(token,'1234567');

            var ob = new todoModel({
                userName:data.data.name,
                subject:dataFromPostman.subject,
                status:dataFromPostman.status,
                date:dataFromPostman.date
            });
            var data = await ob.save();
            if(data==undefined)
            {
                res.status(400);
                res.send("can't insert todo");
            }
            else
            {
                res.status(200);
                res.send(data);
            }
        }
        catch(ob)
        {
            res.status(400);
            res.send(ob.message);
        }
    }
}


var readTodo = async (req,res)=>
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

            var data = await todoModel.find({userName:data.data.name});
            if(data[0]==undefined)
            {
                res.status(400);
                res.send("can't insert todo");
            }
            else
            {
                res.status(200);
                res.send(data);
            }
            
        }
        catch(ob)
        {
            res.status(400);
            res.send(ob.message);
        }
    }
}


var update = async (req,res)=>
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

                var updateStatus = await todoModel.updateOne({_id:dataFromPostman.id},{$set:{subject:dataFromPostman.subject,status:dataFromPostman.status,date:dataFromPostman.date}})
                
                if(updateStatus.modifiedCount==0)
                {
                    res.status(400);
                    res.send("can't update the todo list");
                }
                else
                {
                    
                    res.status(200);
                    res.send("todo have been updated");
                }
        }
        catch(ob)
        {
            res.status(400);
            res.send(ob.message);
        }
    }
}




var updateStatus = async (req,res)=>
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

                var updateStatus = await todoModel.updateOne({_id:dataFromPostman.id},{$set:{status:dataFromPostman.status}})
                
                if(updateStatus.modifiedCount==0)
                {
                    res.status(400);
                    res.send("can't update the todo list status");
                }
                else
                {
                    
                    res.status(200);
                    res.send("todo status have been updated");
                }
        }
        catch(ob)
        {
            res.status(400);
            res.send(ob.message);
        }
    }
}


var filterByStatus = async (req,res)=>
{
    var token = req.headers.authorization;
    var dataFromPostman = req.body;
    if(token=='')
    {
        res.status(400);
        res.send("you did not provide any token! please provide token to view you profile");
    }
    else
    {
        try{
            var data = jwt.verify(token,'1234567');

            var data = await todoModel.find({status:dataFromPostman.status});
            if(data[0]==undefined)
            {
                res.status(400);
                res.send("can't find");
            }
            else
            {
                res.status(200);
                res.send(data);
            }
            
        }
        catch(ob)
        {
            res.status(400);
            res.send(ob.message);
        }
    }
}

var filterByDate = async (req,res)=>
{
    var token = req.headers.authorization;
    var dataFromPostman = req.body;
    if(token=='')
    {
        res.status(400);
        res.send("you did not provide any token! please provide token to view you profile");
    }
    else
    {
        try{
            var data = jwt.verify(token,'1234567');

            var data = await todoModel.find({$and:[{date:{$gte:new Date(dataFromPostman.fromDate)}},{date:{$lte:new Date(dataFromPostman.toDate)}}]});
            if(data[0]==undefined)
            {
                res.status(400);
                res.send("can't find");
            }
            else
            {
                res.status(200);
                res.send(data);
            }
            
        }
        catch(ob)
        {
            res.status(400);
            res.send(ob.message);
        }
    }
}


router.route('/createTodo')
    .post(insertTodo);
router.route('/getTodo')
    .get(readTodo);
router.route('/updateTodo')
    .post(update);
router.route('/updateTodoStatus')
    .post(updateStatus);
router.route('/filterTodoByStatus')
    .post(filterByStatus);
router.route('/filterTodoByDate')
    .post(filterByDate);


module.exports=router;