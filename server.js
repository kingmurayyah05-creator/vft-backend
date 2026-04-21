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
   ALLOWED ORIGINS
======================= */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5502",
  "http://localhost:5502",
  "https://victoriafalls-transporters.netlify.app"
];

/* =======================
   CORS (FIXED)
======================= */
app.use(cors({
  origin: function (origin, callback) {
    console.log("🌐 CORS origin:", origin);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ VERY IMPORTANT — allow preflight
app.options("*", cors());

/* =======================
   BODY PARSER
======================= */
app.use(express.json({ limit: "10kb" }));

/* =======================
   SECURITY (after CORS)
======================= */
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
   TEST ROUTE
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