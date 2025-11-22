const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

function generateBookingInvoicePDF(booking, callback) {
  const invoicesDir = path.join(__dirname, "..", "invoices");

  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir);
  }

  const fileName = `booking_${booking.booking_id}.pdf`;
  const filePath = path.join(invoicesDir, fileName);

  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(20).text("Booking Invoice", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Booking ID: ${booking.booking_id}`);
  doc.text(`Amount: ${booking.booking_amount}`);
  doc.text(`Booking Date: ${booking_date}`);
  doc.text(`Notes: ${booking.booking_notes || "-"}`);
  doc.end();

  stream.on("finish", () => callback(null, filePath));
  stream.on("error", (err) => callback(err));
}

module.exports = { generateBookingInvoicePDF };
