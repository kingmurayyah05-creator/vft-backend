import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import Booking from "../models/Booking.js";
import  generateReceipt  from "../utils/generateReceipt.js";
import generateReceiptStream from "../utils/generateReceiptStream.js";
import  sendReceiptEmail  from "../utils/sendReceiptEmail.js";


const router = express.Router();

/* LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { adminId: admin._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

router.delete("/bookings/:id", protectAdmin, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

// 📄 Download receipt (JWT protected)
router.get("/bookings/:id/receipt", protectAdmin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const filePath = await generateReceipt(booking);

    res.download(filePath, `receipt-${booking.bookingRef}.pdf`);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate receipt" });
  }
});

router.post("/bookings/:id/email-receipt", protectAdmin, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  const doc = generateReceiptStream(booking);
  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", async () => {
    const pdfBuffer = Buffer.concat(buffers);
    await sendReceiptEmail(
      booking.email,
      pdfBuffer,
      booking.bookingRef
    );
    res.json({ message: "Receipt emailed successfully" });
  });

  doc.end();
});

// 🔐 Protected admin bookings
router.get("/bookings", protectAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});
export default router;