import { Schema, model } from 'mongoose';

const BookingLogSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  action: { type: String }, // e.g. 'ATTEMPT_BOOK', 'BOOK_SUCCESS', 'BOOK_FAILED'
  message: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export default model('BookingLog', BookingLogSchema);
