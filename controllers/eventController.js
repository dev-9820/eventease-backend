import Event from '../models/Event.js';
import genEventId from '../utils/genEventId.js';
import formatDate from '../utils/formatDate.js';
import computeStatus from '../utils/computeStatus.js';

export async function createEvent(req,res,next) {
  try {
    const {
      title, description, category, locationType, location, startDate, endDate, capacity
    } = req.body;
    if (!title || !startDate) return res.status(400).json({ message: 'title and startDate required' });
    const eventId = genEventId(startDate);
    const e = await Event.create({
      eventId,
      title,
      description,
      category,
      locationType,
      location,
      startDate,
      endDate,
      capacity,
      createdBy: req.user._id
    });
    res.status(201).json({ event: e });
  } catch (err) { next(err); }
}

export async function updateEvent(req,res,next) {
  try {
    const e = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if(!e) return res.status(404).json({ message: 'Event not found' });
    res.json({ event: e });
  } catch (err) { next(err); }
}

export async function deleteEvent(req,res,next) {
  try {
    const e = await Event.findByIdAndDelete(req.params.id);
    if(!e) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
}

export async function getEvent(req,res,next) {
  try {
    const e = await Event.findById(req.params.id);
    if(!e) return res.status(404).json({ message: 'Event not found' });
    const status = computeStatus(e.startDate);
    const formatted = {
      ...e.toObject(),
      startDateFormatted: formatDate(e.startDate),
      endDateFormatted: e.endDate ? formatDate(e.endDate) : null,
      status
    };
    res.json({ event: formatted });
  } catch (err) { next(err); }
}

export async function listEvents(req,res,next) {
  try {
    // filter by category, locationType, date range, pagination
    const { category, locationType, startDate, endDate, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (locationType) filter.locationType = locationType;
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }
    const skip = (page-1)*limit;
    const events = await Event.find(filter).sort({ startDate: 1 }).skip(skip).limit(parseInt(limit));
    const payload = events.map(e => ({
      ...e.toObject(),
      startDateFormatted: formatDate(e.startDate),
      endDateFormatted: e.endDate ? formatDate(e.endDate) : null,
      status: computeStatus(e.startDate)
    }));
    res.json({ events: payload });
  } catch (err) { next(err); }
}
