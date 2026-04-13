import nodemailer from "nodemailer";
import fs from "fs";

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

export default async function sendEmail({ to, subject, html, attachmentPath }) {
  const mailOptions = {
    from: `"Victoria Falls Transporters" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
    attachments: attachmentPath
      ? [{ filename: "receipt.pdf", path: attachmentPath }]
      : []
  };

  await transporter.sendMail(mailOptions);
}