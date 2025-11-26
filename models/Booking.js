import { Schema, model } from 'mongoose';

const BookingSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  seats: { type: Number, default: 1 }, // 1 or 2
  status: { type: String, enum: ['CONFIRMED','CANCELLED'], default: 'CONFIRMED' },
  createdAt: { type: Date, default: Date.now },
  confirmationCode: { type: String }
});

export default model('Booking', BookingSchema);
