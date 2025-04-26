import { model, Schema, Types } from 'mongoose';

const tokenSchema = new Schema({
  refreshToken: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isValid: {
    type: Boolean,
    default: true,
    required: true,
  },
  userIp: {
    type: String,
  },
  userAgent: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

export default model('Token', tokenSchema);
