import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connetDB } from "./lib/db.js";
import { app,server } from "./lib/socket.js";
import path from 'path'
dotenv.config();
const port = process.env.PORT;
const __dirname=path.resolve()
// to extract json  data from the body
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // replace with your frontend URL
  credentials: true, // enables setting of cookies in the response
}))
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname,"../app/dist" )))
  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../app","dist","index.html"))
  })
}
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
  connetDB()
});
