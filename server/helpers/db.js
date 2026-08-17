const mongoose = require("mongoose");
const { MONGODB_URL } = require(".");

let isConnected = false;

exports.connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  const dbUrl = MONGODB_URL || process.env.MONGODB_URL || process.env.MONGODB_URI;
  if (!dbUrl) {
    throw new Error("MONGODB_URL is missing in environment variables on Vercel.");
  }

  try {
    const db = await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = db.connections[0].readyState;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};
