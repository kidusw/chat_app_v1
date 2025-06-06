import jwt from "jsonwebtoken"
import User from "../models/user-model.js"

export const protectRoute = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({message:"unauthorized not token provided"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded) return res.status(401).json({message:"token is invalid"});

        console.log(decoded.userId);

        const user = await User.findById(decoded.userId)

        if(!user) return res.status(400).json({message:"user not found"});

        req.user = user;

        next();

    } catch (error) {
        console.log("auth middleware error",error.message);
        res.status(500).json({message:"Internal sever error"});
    }
}