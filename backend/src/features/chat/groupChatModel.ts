import { Schema, Types } from 'mongoose';

const groupChatSchema = new Schema({
  groupId: {
    type: Types.ObjectId,
    ref: 'Group',
  },
  sender: {
    type: Types.ObjectId,
    ref: 'User',
  },
  message: {
    type: String,
    required: [true, 'Message field is required.'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
