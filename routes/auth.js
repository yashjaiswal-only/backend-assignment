const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const User = require("../models/User");

router.get("/",(req,res)=>res.status(200).send("this is auth"))

router.post('/createuser',async(req,res)=>{
    try {
        let user = await User.findOne({email:req.body.email} );
        if (user) {
            return res
            .status(400)
            .json("User with this email already exists" );
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            token: secPass,
        }); 
        const data = {
            user: {
              id: user._id,
            },
        };
        const authtoken = jwt.sign(data, JWT_SECRET,{expiresIn:'365d'});
        success=true;
        res.send({success, authtoken });

    } catch (error) {
        res.status(500).send(error); 
    }
})


router.post('/login',
  async(req,res)=>{
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({success, error: "User with this email is not found" });
      }
      const passwordCompare = await bcrypt.compare(password, user.token); //returns true or false
    //   console.log(passwordCompare)
      if (!passwordCompare) {
        return res
          .status(400)
          .json({success, error: "Please try to login with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      let success=true;
      const authtoken = jwt.sign(data, JWT_SECRET,{expiresIn:'365d'});
      res.send({success,authtoken });
    } catch (error) {
      res.status(500).send(error);
    }
})

module.exports = router;
