import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user-model.js";
import bcrypt from "bcryptjs";

export const signup = async(req,res)=>{
    try {
        const{fullName,email,password}=req.body;
        console.log(req.body);

        if(!fullName || !email || !password) return res.status(400).json({message:"you should fill out all fields"});

        if(password.length < 5){
            return res.status(400).json({message:"Password must be at least 6 characters"})
        }
        const user = await User.findOne({email})

        if(user) return res.status(400).json({message:"user already exists"});

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = await User({
            fullname:fullName,
            email:email,
            password:hashedPassword
        })

        if(newUser){
            // generate jwt token
            generateToken(newUser._id,res);
            await newUser.save();
        
            res.status(201).json({message:'user created',
                _id:newUser._id,
                fullname:newUser.fullname,
                email:newUser.email,
                profilePic:newUser.profilePic
            })
        }
        else{
            return res.status(400).json({message:"Invalid user data"});
        }
        
    } catch (error) {
        console.log("signup error: ",error.message);
        res.status(500).json({message:"Internal server error"})
    }
}

export const login = async(req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid credentials"})
        
        const isPasswordCorrect = await bcrypt.compare(password,user.password);

        if(!isPasswordCorrect) return res.status(400).json({message:"Invalid credentials"});

        generateToken(user._id,res);

          res.status(200).json({
                _id:user._id,
                fullname:user.fullname,
                email:user.email,
                profilePic:user.profilePic
            })

    } catch (error) {
        console.log("login error: ",error.message);
        res.status(500).json({message:"Internal server error"})   
    }
}

export const logout = (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({messsage:"Logged out successfully"});
    } catch (error) {
         console.log("logout error: ",error.message);
        res.status(500).json({message:"Internal server error"})   
    }
}

export const updateProfile = async(req,res)=>{
    try {
        const {profilePic} = req.body;
        const userId=req.user._id
       
        if(!profilePic) return res.status(400).json({message:"Profile pic required"})
          
         const uploadResponse= await cloudinary.uploader.upload(profilePic); 
         
         const updatedUser = await User.findByIdAndUpdate(userId,
            {profilePic:uploadResponse.secure_url},{new:true});

            console.log("upload response:",uploadResponse);
            console.log("user data",updatedUser)

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update controller",error.message);
         res.status(500).json({message:"Internal server error"});        
    }
}

export const checkAuth = (req,res)=>{
    try{
        res.status(200).json(req.user);
    }catch(error){
           console.log("error in update controller",error.message);
         res.status(500).json({message:"Internal server error"}); 
    }
}