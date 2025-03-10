import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client"

const BASE_URL = import.meta.env.MODE==="development"?"http://localhost:5100":"/"
export const useAuthStore = create((set,get) => ({  

    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket:null,
    
    checkAuth: async () => {
      try {
        const res = await axiosInstance.get('/auth/check')
        set({ authUser: res.data})
        get().connectSocket()
      } catch (err) {
        console.log('error in  checkauth',err)
        set({ authUser: null })
      }finally{
        set({ isCheckingAuth: false })
      }
    },
    signup: async (data) => {
      set({ isSigningUp: true })
      try {
        const res = await axiosInstance.post('/auth/signup', data)
        toast.success("Acount created successfully")
        set({ authUser: res.data })
        get().connectSocket()
      } catch (err) {
        console.log('error in signup', err)
        toast.error(err.response.data.message)
        set({ authUser: null })
      } finally {
        set({ isSigningUp: false })
      }},
      login:async(data)=>{
        set({isLoggingIn:true})
        try {
          const res=await axiosInstance.post('/auth/login',data)
          set({authUser:res.data})
          toast.success("User logged in successfully")
          get().connectSocket()
        } catch (error) {
          toast.error(error.response.data.message)
        }finally{
           set({isLoggingIn:false})
        }
      },
      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ authUser: null });
          toast.success("Logged out successfully");
          get().disconnectSocket();
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },
      updateProfile: async(data)=>{
        set({isUpdatingProfile:true})
        try { 
          const res=await axiosInstance.put('/auth/update-profile', data)
          set({authUser:res.data})
          toast.success("Profile updated successfully")
        } catch (error) {
          toast.error(error.response.data.message)
        }finally{
          set({isUpdatingProfile:false})
        }
      },
      connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
      
        const socket = io(BASE_URL, {
          query: {
            userId: authUser._id
          }
        });
      
        // Listen for online users before connecting the socket
        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);
        });
      
        socket.on("getOnlineUsers", (userIds) => {
          console.log("Online users received:", userIds);
          set({ onlineUsers: userIds });
        });
      
        // Set the socket in the state before connecting
        set({ socket });
      
        socket.connect();
      },
      
}))