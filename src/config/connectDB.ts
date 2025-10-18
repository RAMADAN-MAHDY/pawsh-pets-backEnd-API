import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const connectDb = async () => {
    try {
      await mongoose.connect(process.env.MONGO_DB as string);
      console.log("✅ MongoDB connected successfully");
    } catch (error: any) {
      console.error("❌ MongoDB connection error:", error.message);
      console.error("📌 Full error:", error);
      process.exit(1);
    }
  };
  

export default connectDb;