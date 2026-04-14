import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const testConnection = async () => {
  try {
    console.log("🔄 Testing MongoDB connection...");
    console.log("📍 URI:", process.env.MONGO_URI ? "✓ Found in .env" : "✗ Missing in .env");
    
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("✅ Successfully connected to MongoDB!");
    console.log("🎉 Your connection is working!");
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    console.error("\n🔍 Please check:");
    console.error("   1. Is your IP added to MongoDB Atlas Network Access?");
    console.error("   2. Is the password correct?");
    console.error("   3. Is the cluster name correct?");
    process.exit(1);
  }
};

testConnection();
