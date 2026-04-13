import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export default function generateReceiptFile(booking) {
  const receiptsDir = path.join(process.cwd(), "receipts");

  if (!fs.existsSync(receiptsDir)) {
    fs.mkdirSync(receiptsDir);
  }

  const filePath = path.join(
    receiptsDir,
    `receipt-${booking.bookingRef}.pdf`
  );

  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  doc.fontSize(20).text("Booking Receipt", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Booking Ref: ${booking.bookingRef}`);
  doc.text(`Name: ${booking.name}`);
  doc.text(`Email: ${booking.email}`);
  doc.text(`Total: $${booking.total}`);
  doc.text(`Date: ${new Date(booking.createdAt).toDateString()}`);

  doc.end();

  return filePath;
}