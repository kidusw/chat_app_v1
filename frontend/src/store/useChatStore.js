import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get)=>({
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
            set({messages:res.data});
        } catch (error) {
            toast.error("error loading messages")
            console.log("error in get messages chat store")
        }finally{
            set({isMessagesLoading:false});
        }
    },
    sendMessage:async(messageData)=>{
           const {selectedUser,messages} =  get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
            set({messages:[...messages,res.data]});
        } catch (error) {
            console.log("error from send messages chat store");
            toast.error(error.response.data.message);
        }
    },
    subsribeToMessages:()=>{
        const {selectedUser}=get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage",(newMessage)=>{
    const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;
            set({
                messages:[...get().messages,newMessage]
            })
        })
        
    },
    unsubscribeFromMessages:()=>{
        const socket =  useAuthStore.getState().socket;
        socket.off("newMessage");
    },
    setSelectedUser:async(selectedUser)=>set({selectedUser}),
    
}))