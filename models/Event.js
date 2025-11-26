import { Schema, model } from 'mongoose';

const EventSchema = new Schema({
  eventId: { type: String, unique: true, required: true }, // EVT-
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  locationType: { type: String, enum: ['Online','In-Person'], default: 'Online' },
  location: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date }, // optional
  capacity: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// virtual for computed status if needed (we'll compute in utils)
EventSchema.set('toJSON', { virtuals: true });
EventSchema.set('toObject', { virtuals: true });

export default model('Event', EventSchema);
