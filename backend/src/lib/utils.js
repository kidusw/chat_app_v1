import jwt from "jsonwebtoken";

export const generateToken = (userId,res)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'7d'});

    res.cookie("jwt",token,{
        maxage:7*24*60*60*1000,// 7days
        httpOnly:true,// xss attacks
        sameSite:"strict",//csrf attacks
        secure:process.env.NODE_ENV !== "development",
    });

    return token;
}