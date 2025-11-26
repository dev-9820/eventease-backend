import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import BookingLog from '../models/BookingLog.js';
import formatDate from '../utils/formatDate.js';
import computeStatus from '../utils/computeStatus.js';
import { randomBytes } from 'crypto';
import { generateTicketPDF } from '../utils/generateTicketPDF.js';
import { sendEmail } from '../utils/sendEmail.js';
import User from "../models/User.js"
function genConfirmation(){
  return randomBytes(4).toString('hex').toUpperCase();
}

export async function createBooking(req, res, next) {
  try {
    const userId = req.user._id;
    const { event: eventId, seats = 1 } = req.body;

    if (![1, 2].includes(Number(seats)))
      return res.status(400).json({ message: 'Seats must be 1 or 2' });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const status = computeStatus(event.startDate);
    if (status !== 'Upcoming')
      return res.status(400).json({ message: 'Event is not open for booking' });

    // seat availability
    const agg = await Booking.aggregate([
      { $match: { event: event._id, status: 'CONFIRMED' } },
      { $group: { _id: null, totalSeats: { $sum: "$seats" } } }
    ]);

    const totalBooked = (agg[0]?.totalSeats) || 0;
    if (totalBooked + seats > event.capacity)
      return res.status(400).json({ message: 'Not enough seats available' });

    // per-user seat limit
    const userBookings = await Booking.find({
      event: event._id,
      user: userId,
      status: 'CONFIRMED'
    });

    const userSeats = userBookings.reduce((s, b) => s + b.seats, 0);

    if (userSeats + seats > 2)
      return res.status(400).json({ message: 'Per-user seat limit exceeded' });

    // create booking
    const booking = await Booking.create({
      event: event._id,
      user: userId,
      seats,
      confirmationCode: genConfirmation()
    });

    // log
    await BookingLog.create({
      user: userId,
      event: event._id,
      action: 'BOOK_SUCCESS',
      message: `Booked ${seats} seats`
    });

    // 1️⃣ Respond immediately (critical fix)
    res.status(201).json({
      success: true,
      message: "Booking successful! Ticket will arrive on your email.",
      booking: {
        id: booking._id,
        event: event._id,
        seats: booking.seats,
        confirmationCode: booking.confirmationCode,
        createdAt: booking.createdAt
      }
    });

    // 2️⃣ Background task (non-blocking)
    setTimeout(async () => {
      try {
        const user = await User.findById(userId);
        const pdfBuffer = await generateTicketPDF({ user, event, booking });

        await sendEmail({
          to: user.email,
          subject: "Your Booking Confirmation - Eventease",
          text: "Your booking is confirmed. Ticket attached.",
          html: `
            <h2>Booking Confirmed 🎉</h2>
            <p>Event: <strong>${event.title}</strong></p>
            <p>Seats: <strong>${booking.seats}</strong></p>
            <p>Confirmation Code: <strong>${booking.confirmationCode}</strong></p>
          `,
          attachments: [
            {
              filename: `Ticket-${booking.confirmationCode}.pdf`,
              content: pdfBuffer,
              contentType: "application/pdf"
            }
          ]
        });

      } catch (error) {
        console.error("Background email/PDF error:", error);
      }
    }, 0); // run after event loop

  } catch (err) {
    next(err);
  }
}

export async function listUserBookings(req,res,next) {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ user: userId }).populate('event');
    const payload = bookings.map(b => ({
      id: b._id,
      event: {
        id: b.event._id,
        title: b.event.title,
        location: b.event.location,
        locationType: b.event.locationType,
        eventId: b.event.eventId,
        startDate: formatDate(b.event.startDate),
        status: computeStatus(b.event.startDate)
      },
      seats: b.seats,
      status: b.status,
      confirmationCode: b.confirmationCode,
      createdAt: formatDate(b.createdAt)
    }));
    res.json({ bookings: payload });
  } catch (err) { next(err); }
}

export async function cancelBooking(req,res,next) {
  try {
    const bookingId = req.params.id;
    const userId = req.user._id;
    const booking = await Booking.findById(bookingId).populate('event');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (String(booking.user) !== String(userId) && req.user.role !== 'admin') return res.status(403).json({ message: 'Not allowed' });

    // can only cancel if event hasn't started (Upcoming)
    const status = computeStatus(booking.event.startDate);
    if (status !== 'Upcoming') return res.status(400).json({ message: 'Cannot cancel booking after event started or completed' });

    booking.status = 'CANCELLED';
    await booking.save();

    await BookingLog.create({
      user: userId,
      event: booking.event._id,
      action: 'CANCEL',
      message: `Cancelled booking ${booking._id}`
    });

    res.json({ message: 'Booking cancelled' });
  } catch (err) { next(err); }
}

// Admin: view attendees for an event
export async function getAttendees(req,res,next) {
  try {
    const eventId = req.params.eventId;
    const bookings = await Booking.find({ event: eventId, status: 'CONFIRMED' }).populate('user','name email');
    const attendees = bookings.flatMap(b => {
      return Array(b.seats).fill(0).map((_, idx) => ({
        bookingId: b._id,
        user: { id: b.user._id, name: b.user.name, email: b.user.email },
        seats: b.seats
      }));
    });
    res.json({ attendees });
  } catch (err) { next(err); }
}
