import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

export const useChatStore = create((set)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,

    getUsers:async()=>{
        set({isUsersLoading:true});

        try {
            const res = await axiosInstance.get('/messages/users');
            set({users:res.data});
        } catch (error) {
            toast.error("Error fetching users");
            console.log("error from get users chat store")
        }finally{
            set({isUsersLoading:false})
        }
    },
    getMessages:async(userId)=>{
        set({isMessagesLoading:true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({message:res.data});
        } catch (error) {
            toast.error("error loading messages")
            console.log("error in get messages chat store")
        }finally{
            set({isMessagesLoading:false});
        }
    },
    setSelectedUser:async(selectedUser)=>set({selectedUser}),
}))