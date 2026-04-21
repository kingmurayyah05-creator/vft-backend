import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import mongoose from "mongoose";

import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

/* =======================
   CORS — RENDER SAFE
======================= */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());

/* =======================
   MIDDLEWARE
======================= */
app.use(express.json({ limit: "10kb" }));

app.use(helmet({
  crossOriginResourcePolicy: false
}));

/* =======================
   DATABASE
======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection failed:", err));

/* =======================
   ROUTES
======================= */
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

/* =======================
   TEST
======================= */
app.get("/", (req, res) => {
  res.send("Server is running");
});

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});