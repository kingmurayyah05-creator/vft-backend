import express from "express";
import Booking from "../models/Booking.js";
import { generateBookingRef } from "../utils/generateBookingRef.js";
import authMiddleware from "../middleware/authMiddleware.js";
import sendReceiptEmail  from "../utils/sendReceiptEmail.js";
import generateReceipt from "../utils/generateReceipt.js";
import sendEmail from "../utils/sendEmail.js";
const router = express.Router();

/**
 * ===============================
 * CUSTOMER: CREATE BOOKING
 * Public route
 * ===============================
 */
router.post("/", async (req, res) => {
  try {
    console.log("📩 Incoming booking:", req.body);

    const {
      name,
      email,
      phone,
      guests,
      arrivalDate,
      arrivalTime,
      pickupLocation,
      flightNumber,
      country,
      paymentMethod,
      specialRequests,
      services,
      totalPrice,
    } = req.body;

    if (!services || services.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No services selected",
      });
    }

    const bookingRef = generateBookingRef();

    const newBooking = new Booking({
      bookingRef,
      name,
      email,
      phone,
      guests,
      arrivalDate,
      arrivalTime,
      pickupLocation,
      flightNumber,
      country,
      paymentMethod,
      specialRequests,
      services,
      totalPrice,
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Booking saved successfully",
      bookingRef,
    });
  } catch (error) {
    console.error("❌ Booking save error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save booking",
    });
  }
});

/**
 * ===============================
 * ADMIN: GET ALL BOOKINGS
 * Protected route (JWT)
 * ===============================
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("❌ Fetch bookings error:", error);
    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
});


router.post("/", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    const pdfPath = await generateReceipt(booking);

    await sendEmail({
      to: booking.email,
      subject: "Booking Confirmation – Victoria Falls Transporters",
      html: `
        <h2>Booking Confirmed</h2>
        <p>Dear ${booking.name},</p>
        <p>Your booking has been confirmed.</p>
        <p><strong>Booking Ref:</strong> ${booking.bookingRef}</p>
        <p>Total: <strong>$${booking.totalPrice}</strong></p>
        <p>Please find your receipt attached.</p>
        <br>
        <p>Victoria Falls Transporters<br>Africana Tours</p>
      `,
      attachmentPath: pdfPath
    });

    res.status(201).json({ message: "Booking confirmed & email sent" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
});


export default router;