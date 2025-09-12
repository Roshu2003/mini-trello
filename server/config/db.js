const mongoose = require("mongoose");

async function connectDB(uri) {
  try {
    await mongoose.connect(process.env.MONGO_URI); // ✅ no extra options needed
    console.log("✅ MongoDB connected...");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
