import axios from "axios";
import {create} from "zustand";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    checkAuth:async()=>{
        try {
            const res = axiosInstance.get('/auth/check');
            set({authUser:res.data})
        
        } catch (error) {
            console.log('error in check auth');
            set({authUser:null})

        }finally{
            set({isCheckingAuth:false});
        }
    },
    signup:async(data)=>{
        set({isSigningUp:true});

        try {
        const res = await axiosInstance.post('/auth/signup',data);
        set({authUser:res.data});
        console.log("from auth",authUser)
        toast.success("Account created Successfully")
        } catch (error) {
            console.log("errro from sign up auth")
            toast.error(error.response.data.message);

        }finally{
            set({isSigningUp:false});
        }
    }
}))