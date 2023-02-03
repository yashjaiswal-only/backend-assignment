const mongoose=require('mongoose');
const {Schema}=mongoose;

const BlogSchema = new Schema({
    title:{ 
        type:String,
        required:true
    },    
    description:{
        type:String,
        required:true
    },  
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    createdOn:{
        type:Date,
        default:Date.now
    }

});
module.exports=mongoose.model('blogs',BlogSchema);