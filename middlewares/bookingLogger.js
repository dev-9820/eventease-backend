import BookingLog from '../models/BookingLog.js';

/* Middleware that logs booking attempts. */

const bookingLogger = async (req, res, next) => {
  try {
    const user = req.user ? req.user._id : null;
    const event = req.body.event || null;
    await BookingLog.create({
      user,
      event,
      action: 'ATTEMPT_BOOK',
      message: `User ${user} attempting to book event ${event}`
    });
    console.log(`[BookingLogger] User ${user} attempt to book ${event} at ${new Date().toISOString()}`);
  } catch (err) {
    console.warn('BookingLogger failed', err);
  } finally {
    next();
  }
};

export default bookingLogger;
