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
        toast.error("Account creation failed")
        set({ authUser: null })
      } finally {
        set({ isSigningUp: false })
      }}
}))