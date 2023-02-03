const mongoose=require('mongoose');
require('dotenv').config()
const mongoURI=process.env.MONGOURI;

mongoose.set("strictQuery", false); 
const connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("connected to  mongo successfully") ;
    })
} 

module.exports=connectToMongo;