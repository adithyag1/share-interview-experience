const User = require('../models/User');
const jwt=require('jsonwebtoken');

module.exports.userVerification=(req,res)=>{
    const token=req.cookies.token;
    if(!token){
        return res.json({status:false});
    }
    jwt.verify(token,process.env.JWT_SECRET,async(err,data)=>{
        if(err){
            return res.json({status:false});
        }
        const user=await User.findById(data._id);
        if(user){
            const {_id,username}=user;
            return res.json({status:true, _id,username});
        }
        return res.json({status:false});
    });
}