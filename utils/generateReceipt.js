import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export default function generateReceipt(booking) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });

    const filePath = path.join(
      process.cwd(),
      "receipts",
      `receipt-${booking.bookingRef}.pdf`
    );

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // LOGO
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 45, { width: 80 });
    }

    doc.fontSize(20).text("Victoria Falls Transporters", 150, 50);
    doc.fontSize(10).text("Africana Tours", 150, 75);
    doc.moveDown(3);

    // CUSTOMER DETAILS
    doc.fontSize(14).text("Booking Receipt", { underline: true });
    doc.moveDown();
    doc.fontSize(11).text(`Name: ${booking.name}`);
    doc.text(`Email: ${booking.email}`);
    doc.text(`Booking Ref: ${booking.bookingRef}`);
    doc.text(`Date: ${new Date(booking.createdAt).toDateString()}`);
    doc.moveDown();

    // SERVICES
    doc.fontSize(13).text("Booked Services", { underline: true });
    doc.moveDown(0.5);

    booking.services.forEach((s) => {
      doc.text(`${s.name} - $${s.price}`);
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total: $${booking.totalPrice}`, { align: "right" });

    doc.moveDown(3);
    doc.fontSize(10).text(
      "Thank you for booking with Victoria Falls Transporters – Africana Tours",
      { align: "center" }
    );

    doc.end();

    stream.on("finish", () => resolve(filePath));
  });
}