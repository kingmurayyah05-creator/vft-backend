import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },

    room_type: { type: String, required: true },
    rooms: { type: Number, required: true },
    check_in: { type: Date, required: true },
    check_out: { type: Date, required: true },

    adults: { type: Number, required: true },
    children: { type: Number, default: 0 },

    board_preference: String,
    airport_transfer: String,
    contact_method: String,
    arrival_time: String,
    special_requests: String
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);