import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 MONGODB CONNECTION DIAGNOSTIC\n");
console.log("=" .repeat(50));

// Check 1: .env file
console.log("\n✅ Check 1: Environment Variables");
console.log("-----------------------------------");
if (process.env.MONGO_URI) {
  const uri = process.env.MONGO_URI;
  const masked = uri.replace(/:[^:]*@/, ":****@"); // Hide password
  console.log("✓ MONGO_URI found:");
  console.log(`  ${masked}`);
  
  // Parse the URI
  const match = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/\?appName=(.+)/);
  if (match) {
    console.log(`\n  Username: ${match[1]}`);
    console.log(`  Password: ${match[2].length > 0 ? "✓ Set" : "✗ Empty"}`);
    console.log(`  Cluster: ${match[3]}`);
    console.log(`  App: ${match[4]}`);
  }
} else {
  console.log("✗ MONGO_URI NOT FOUND in .env!");
}

// Check 2: Test connection
console.log("\n✅ Check 2: Testing Connection");
console.log("-----------------------------------");

const testConnection = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log("✅ Connected successfully!");
    console.log(`✅ Database: ${mongoose.connection.db.name}`);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`✅ Collections found: ${collections.length}`);
    collections.forEach(c => {
      console.log(`   - ${c.name}`);
    });
    
    await mongoose.connection.close();
    console.log("\n✅ CONNECTION IS WORKING!");
    process.exit(0);
    
  } catch (error) {
    console.error("❌ Connection failed!");
    console.error(`\nError: ${error.message}\n`);
    
    // Diagnose the error
    console.log("🔧 TROUBLESHOOTING:");
    console.log("-------------------");
    
    if (error.message.includes("ECONNREFUSED")) {
      console.log("❌ Connection refused - Your IP might not be whitelisted!");
      console.log("\nFIX:");
      console.log("1. Go to: https://cloud.mongodb.com");
      console.log("2. Go to your cluster 'spendwise'");
      console.log("3. Click 'Network Access' in left sidebar");
      console.log("4. Add IP: 0.0.0.0/0");
      console.log("5. Wait 1-2 minutes");
      console.log("6. Try again");
    } else if (error.message.includes("authentication failed")) {
      console.log("❌ Authentication failed - Wrong password!");
      console.log("\nFIX:");
      console.log("1. Check your password in MongoDB Atlas");
      console.log("2. Make sure special characters are URL encoded");
      console.log("3. Update .env with correct password");
    } else if (error.message.includes("getaddrinfo")) {
      console.log("❌ DNS/Network error - Cluster name might be wrong!");
      console.log("\nFIX:");
      console.log("1. Verify cluster name is 'spendwise'");
      console.log("2. Check the connection string from MongoDB Atlas");
      console.log("3. Update .env with correct cluster URL");
    } else {
      console.log(`❌ Unknown error: ${error.message}`);
    }
    
    process.exit(1);
  }
};

testConnection();
