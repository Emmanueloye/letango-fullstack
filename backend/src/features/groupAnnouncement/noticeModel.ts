import { model, Schema, Types } from 'mongoose';

const noticeSchema = new Schema({
  groupId: {
    type: Types.ObjectId,
    ref: 'Group',
  },
  description: {
    type: String,
    required: true,
  },
  noticeType: {
    type: String,
    required: true,
    enum: {
      values: ['welcome', 'contribute', 'withdraw'],
      message: 'Invalid value',
    },
  },
  createdAt: { type: Date, required: true, default: Date.now() },
});

export default model('Notice', noticeSchema);
