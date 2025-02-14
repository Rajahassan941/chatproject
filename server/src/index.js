import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connetDB } from "./lib/db.js";
dotenv.config();
const app = express();
const port = process.env.PORT;
// to extract json  data from the body
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // replace with your frontend URL
  credentials: true, // enables setting of cookies in the response
}))
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  connetDB()
});
