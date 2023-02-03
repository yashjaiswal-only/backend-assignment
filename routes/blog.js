const express = require("express");
const router = express.Router();
var fetchuser=require('../middleware/fetchuser')
const Blog=require('../models/Blog')
// router.get("/",(req,res)=>res.send("this is blog"))

//get all the blogs
router.get('/',async(req,res)=>{
    const blogs=await Blog.find();
    res.json(blogs)
})

//create a blog
router.post('/addblog',fetchuser,async(req,res)=>{
    try {
        const {title,description,tag}=req.body;    
        const blog=new Blog({
            title,description,createdBy:req.user.id
        })
        const saved=await blog.save();
        res.json(saved)   //saveNote is added to response
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");
    }
})

//get all user blog
router.get('/usersblog',fetchuser,async(req,res)=>{
    try {
        const blogs=await Blog.find({createdBy:req.user.id});   //find all the blogs createdby this user
        res.json(blogs) 
    } catch (error) {
        // console.error(error.message);
        res.status(500).send(error);
    }
})

//update
router.put('/:id',fetchuser,async (req,res)=>{ 
    const {title,description}=req.body;
    try {
        //find the blog to be updated and update it
        let blog=await Blog.findById(req.params.id);
        if(!blog){return res.status(404).send("Not Found")};   //found by id given in url
        if(blog.createdBy.toString()!=req.user.id){  //requested user should be equal to user of id note
            return res.status(401).send("Not Allowed");
        }
        blog=await Blog.findByIdAndUpdate(req.params.id,{$set:req.body});
        res.json({"Success":"Updated Successfully below blog",blog});   //this returns response as json , and send returns simple text
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");
    }
})

//delete
router.delete('/:id',fetchuser,async (req,res)=>{ //request,response
    try {
        
        //find the note to be delete and delete it
        let blog=await Blog.findById(req.params.id);
        if(!blog){return res.status(404).send("Not Found")};   //found by id given in link
        //allow deletion only if user owns this blog
        if(blog.createdBy.toString()!=req.user.id){  //requested user should be equal to user of id note
            return res.status(401).send("Not Allowed");
        }
        note=await Blog.findByIdAndDelete(req.params.id);
        res.json({"Success":"Blog has been deleted",blog});   //this returns response as json , and send returns simple text
    } catch (error) {
        // console.error(error.message);
        res.status(500).send(error);
    }
})


module.exports = router;
