var jwt=require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser=(req,res,next)=>{
    //Get the user from the jwt token and add id to req object
    const token=req.header('auth-token');   
    if(!token){
        return res.status(401).send({error:"Please authenticate using a valid token"})
    }
    try{
        const data =jwt.verify(token,JWT_SECRET)    //verify the auth-token (which is generated as a response of login correctly)
        req.user=data.user;  
        // console.log(req.user)
        next(); //called async func in 3rd argument
    }
    catch(error){
        return res.status(401).send({error:"Please authenticate using a valid token"})
    }
}

module.exports=fetchuser;