import { InferSchemaType, Query } from 'mongoose';
import { Model, model, Schema, Types } from 'mongoose';
import User from '../users/userModel';

const personalTransactionSchema = new Schema({
  userRef: String,
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
  transactionId: {
    type: Number,
    // required: true,
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
  fee: Number,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

type ITransaction = InferSchemaType<typeof personalTransactionSchema>;

// interface TransactionModel extends Model<ITransaction> {
//   calcBalance: (userRef: string) => void;
//   calcInflow: (userRef: string) => void;
//   calcOutflow: (userRef: string) => void;
// }

personalTransactionSchema.pre(
  /^find/,
  function (this: Query<{}, ITransaction>) {
    this.populate({
      path: 'fromId',
      select: 'surname otherNames groupName',
    }).populate({
      path: 'toId',
      select: 'surname otherNames groupName',
    });
  }
);

export default model('PersonalTransaction', personalTransactionSchema);
