import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
export const useAuthStore = create((set) => ({  

    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    
    checkAuth: async () => {
      try {
        const res = await axiosInstance.get('/auth/check')
        set({ authUser: res.data})
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
        } catch (error) {
          toast.error(error.response.data.message)
        }finally{
           set({isLoggingIn:false})
        }
      },
      logout:async()=>{
        try {
          await axiosInstance.post('/auth/logout')
          toast.success("User logged out successfully")
          set({ authUser: null })
        } catch (err) {
          console.log('error in logout', err)
          toast.error("Logout failed")
          set({ authUser: null })
        }
      },
      updateProfile: async(data)=>{
        try { 
          
        } catch (error) {
          
        }
      }
}))