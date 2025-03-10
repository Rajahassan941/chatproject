import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, password, email } = req.body;
  try {
    if (!fullName || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ message: "User email already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ fullName, password: hashedPassword, email });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res
        .status(201)
        .json({
          message: "User created successfully",
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePicture: newUser.profilePicture,
        });
    } else {
      res
        .status(400)
        .json({ message: "Failed to create user in signup controller" });
    }
  } catch (error) {}
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    generateToken(user._id, res);
    res
      .status(200)
      .json({
        message: "Login successful",
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
      });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
export const logout = (req, res) => {
 try {
     res.cookie("jwt","",{maxAge:0})
     res.status(200).json({message: "User logged out successfully"})
 } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Server error" });
 }
};
export const updateProfile =async (req, res) => {
 try {
  const {profilePicture} = req.body;
 const userId= req.user._id 
 if(!profilePicture){
  return res.status(400).json({message: "Profile picture is required"})
 }
 const uploadResponse=await cloudinary.uploader.upload(profilePicture)
 const updatedUser=await User.findByIdAndUpdate(userId,{profilePicture: uploadResponse.secure_url},{new:true})
 res.status(200).json(updatedUser)
 } catch (error) {
    console.log("Error in update profile controller", error.message);
    res.status(500).json({ message: "Server error" });
 }
};
export const checkAuth = (req, res) => {
 try {
 res.status(200).json(req.user)
 } catch (error) {
    console.log("Error in checkauth  controller", error.message);
    res.status(500).json({ message: "Server error" });
 }
};
