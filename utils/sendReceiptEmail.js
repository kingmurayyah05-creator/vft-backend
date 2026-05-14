import nodemailer from "nodemailer";

const gmailUser = process.env.GMAIL_USER;
const gmailPass = process.env.GMAIL_APP_PASSWORD;

if (!gmailUser || !gmailPass) {
  console.error("❌ Gmail SMTP credentials missing");
}

const transporter = nodemailer.createTransport({
  service: "gmail",          // ✅ IMPORTANT
  auth: {
    user: gmailUser,
    pass: gmailPass
  }
});

export default async function sendReceiptEmail(to, pdfBuffer, bookingRef) {
  await transporter.sendMail({
    from: `"Victoria Falls Transporters" <${gmailUser}>`,
    to: to.trim(),
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