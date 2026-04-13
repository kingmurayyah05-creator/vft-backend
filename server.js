import helmet from "helmet";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5502",
  "http://localhost:5502",
  process.env.CLIENT_URL,
  "https://your-frontend-domain.netlify.app" // add later
];


/* =======================
   MIDDLEWARE
======================= */
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: "10kb" }));
app.use(helmet());

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
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});