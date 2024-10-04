import jwt from 'jsonwebtoken'

export const authUser=(req,res,next)=>{

    // console.log(req.cookies,"cookies===>");
    const {token}=req.cookies;
    console.log("token====>",token);
    
    if(!token){
        return res.status(401).json({success:false,message:"User not authenticated"})
             }

             const tokenVerifyed=jwt.verify(token,process.env.JWT_SECRET_KEY)
             if(!tokenVerifyed){
                return res.status(400).json({success:false,message:"Invalid token"})
                }
 req.user=tokenVerifyed
          
                next();
} 
