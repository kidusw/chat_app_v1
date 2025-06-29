import express from "express";
import authRoutes from "./routes/auth-route.js";
import messageRoutes from "./routes/message-route.js"
import "dotenv/config";
import connectDb from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {app,server} from "./lib/socket.js";


// const app = express();

const PORT = process.env.PORT ;

app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}));

app.use('/api/auth',authRoutes);
app.use('/api/messages',messageRoutes);

server.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
    connectDb();
})