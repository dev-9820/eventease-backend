import { Schema, model } from 'mongoose';
import { genSalt, hash, compare } from 'bcryptjs';

const UserSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String },
  role: { type: String, enum: ['user','admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before save
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
});

UserSchema.methods.comparePassword = function(candidate) {
  return compare(candidate, this.password);
};

export default model('User', UserSchema);
