import express from "express";
import Enquiry from "../models/Enquiry.js";

const router = express.Router();

/* =========================
   CREATE ENQUIRY
========================= */
router.post("/", async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);

    res.status(201).json({
      message: "Enquiry submitted successfully",
      enquiryId: enquiry._id
    });

  } catch (err) {
    console.error("ENQUIRY ERROR:", err);
    res.status(500).json({
      message: "Failed to submit enquiry"
    });
  }
});

export default router;