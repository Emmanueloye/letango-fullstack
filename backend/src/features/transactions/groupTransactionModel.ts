import { model, Schema, Types } from 'mongoose';

const groupTransactionSchema = new Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  fromId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  toId: {
    type: Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  transactionType: {
    type: String,
    required: true,
    enum: {
      values: ['transfer', 'contribute', 'withdrawal'],
      message: 'Invalid transaction type value.',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model('GroupTransaction', groupTransactionSchema);
