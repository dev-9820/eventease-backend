import { Router } from 'express';
const router = Router();
import { createBooking, listUserBookings, cancelBooking, getAttendees } from '../controllers/bookingController.js';
import auth from '../middlewares/auth.js';
import bookingLogger from '../middlewares/bookingLogger.js';
import permit from '../middlewares/roles.js';

router.post('/', auth, bookingLogger, createBooking);
router.get('/me', auth, listUserBookings);
router.delete('/:id', auth, cancelBooking);

// Admin route: attendees list for an event
router.get('/event/:eventId/attendees', auth, permit('admin'), getAttendees);

export default router;