import { Router } from 'express';
const router = Router();
import { listEvents, getEvent, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import auth from '../middlewares/auth.js';
import permit from '../middlewares/roles.js';

// public list & view
router.get('/', listEvents);
router.get('/:id', getEvent);

// admin protected routes
router.post('/', auth, permit('admin'), createEvent);
router.put('/:id', auth, permit('admin'), updateEvent);
router.delete('/:id', auth, permit('admin'), deleteEvent);

export default router;
