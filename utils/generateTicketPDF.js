import PDFDocument from 'pdfkit';

export function generateTicketPDF({ user, event, booking }) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // PDF header
      doc.fontSize(22).text("Eventease Booking Confirmation", { align: "center" });
      doc.moveDown();

      // User details
      doc.fontSize(14).text(`Name: ${user.name}`);
      doc.text(`Email: ${user.email}`);
      doc.moveDown();

      // Event details
      doc.fontSize(16).text("Event Details", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(14).text(`Title: ${event.title}`);
      doc.text(`Event ID: ${event.eventId}`);
      doc.text(`Category: ${event.category}`);
      doc.text(`Location: ${event.location}`);
      doc.text(`Start Date: ${new Date(event.startDate).toUTCString()}`);
      doc.moveDown();

      // Booking details
      doc.fontSize(16).text("Booking Details", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(14).text(`Seats: ${booking.seats}`);
      doc.text(`Confirmation Code: ${booking.confirmationCode}`);
      doc.text(`Booking Date: ${new Date(booking.createdAt).toUTCString()}`);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
