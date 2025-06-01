import { InferSchemaType, model, Query, Schema, Types } from 'mongoose';

const groupTransactionSchema = new Schema({
  groupRef: String,
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
    // required: true,
  },
  fromGroup: {
    type: Types.ObjectId,
    ref: 'Group',
  },
  toId: {
    type: Types.ObjectId,
    ref: 'Group',
    // required: true,
  },
  transactionRef: {
    type: String,
    required: true,
  },
  contribution: {
    type: Number,
    required: true,
  },
  bank: String,
  channel: String,
  description: {
    type: String,
    required: true,
  },
  head: String,
  headType: String,
  transactionType: {
    type: String,
    required: true,
    enum: {
      values: ['transfer', 'contribute', 'withdrawal'],
      message: 'Invalid transaction type value.',
    },
  },
  fee: Number,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

type IGroupTransact = InferSchemaType<typeof groupTransactionSchema>;

groupTransactionSchema.pre(/^find/, function (this: Query<{}, IGroupTransact>) {
  this.populate({
    path: 'fromId',
    select: 'surname otherNames groupName',
  }).populate({
    path: 'toId',
    select: 'surname otherNames groupName',
  });
});

export default model('GroupTransaction', groupTransactionSchema);
