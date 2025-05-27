import mongoose from "mongoose"

const connectDb = async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log(`DataBase connected: ${conn.connection.host}`);
    } catch (error) {
        console.log('cannot connect db');
        process.exit(1);
    }
}

export default connectDb;