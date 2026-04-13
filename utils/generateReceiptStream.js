import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export default function generateReceiptStream(booking) {
  const doc = new PDFDocument({ margin: 50 });

  /* =====================
     LOGO
  ===================== */
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 40, { width: 80 });
  }

  /* =====================
     HEADER
  ===================== */
  doc
    .fontSize(20)
    .text("Victoria Falls Transporters", 150, 45)
    .fontSize(10)
    .text("Africana Tours", 150, 70);

  doc.moveDown(4);

  /* =====================
     RECEIPT TITLE
  ===================== */
  doc
    .fontSize(16)
    .text("Booking Receipt", { align: "center", underline: true });

  doc.moveDown(2);

  /* =====================
     CUSTOMER DETAILS
  ===================== */
  doc.fontSize(11);
  doc.text(`Booking Ref: ${booking.bookingRef}`);
  doc.text(`Name: ${booking.name}`);
  doc.text(`Email: ${booking.email}`);
  doc.text(`Date: ${new Date(booking.createdAt).toDateString()}`);

  doc.moveDown(2);

  /* =====================
     SERVICES TABLE
  ===================== */
  doc.fontSize(13).text("Booked Services", { underline: true });
  doc.moveDown(1);

  booking.services.forEach((service, index) => {
    doc
      .fontSize(11)
      .text(
        `${index + 1}. ${service.name}`,
        { continued: true }
      )
      .text(`  $${service.price}`, { align: "right" });
  });

  doc.moveDown(2);

  /* =====================
     TOTAL
  ===================== */
  doc
    .fontSize(14)
    .text(`Total Amount: $${booking.totalPrice}`, {
      align: "right",
      underline: true,
    });

  doc.moveDown(3);

  /* =====================
     FOOTER
  ===================== */
  doc
    .fontSize(10)
    .text(
      "Thank you for choosing Victoria Falls Transporters – Africana Tours",
      { align: "center" }
    );

  return doc;
}