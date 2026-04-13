import nodemailer from "nodemailer";
import "dotenv/config";
console.log("DEBUG GMAIL_USER:", process.env.GMAIL_USER);
console.log("DEBUG GMAIL_PASS EXISTS:", !!process.env.GMAIL_APP_PASSWORD);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // ✅ REQUIRED
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false // ✅ FIXES self-signed cert error
  }
});

export default async function sendReceiptEmail(to, pdfBuffer, bookingRef) {
  await transporter.sendMail({
    from: `"Victoria Falls Transporters" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Your Booking Receipt (${bookingRef})`,
    text: "Please find your booking receipt attached.",
    attachments: [
      {
        filename: `receipt-${bookingRef}.pdf`,
        content: pdfBuffer
      }
    ]
  });
}