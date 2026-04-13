import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const existingAdmin = await Admin.findOne({ email: "admin@company.com" });
if (existingAdmin) {
  console.log("⚠️ Admin already exists");
  process.exit();
}

await Admin.create({
  email: "admin@company.com",
  password: "admin123",
});

console.log("✅ Admin created successfully");
process.exit();