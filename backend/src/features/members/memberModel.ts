import { model, Schema, Types } from 'mongoose';

const memberSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  groupId: {
    type: Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model('Members', memberSchema);
