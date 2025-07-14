const mongoose = require("mongoose");
const { MONGODB_URL, ATLAS_URL } = require(".");
exports.connectDB = async () => {
  await mongoose.connect(ATLAS_URL);
  console.log(`MongoDB connected`, ATLAS_URL);
};