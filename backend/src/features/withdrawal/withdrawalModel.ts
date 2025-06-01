import { InferSchemaType, model, Query, Schema, Types } from 'mongoose';

const withdrawalSchema = new Schema({
  groupRef: String,
  requester: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: [true, 'Receiving account name field is required.'],
  },
  fromGroup: {
    type: Types.ObjectId,
    ref: 'Group',
  },
  contribution: {
    type: Number,
    required: [true, 'Amount field is required.'],
  },
  bank: {
    type: String,
    required: [true, 'Receiving bank field is required.'],
  },
  description: {
    type: String,
    required: [true, 'Description field is required.'],
  },
  accountNumber: {
    type: String,
    required: [true, 'Amount field is required.'],
  },
  head: String,
  headType: String,

  approvalStatus: {
    type: String,
    enum: {
      values: ['pending', 'reject', 'approve'],
      message: 'Invalid status',
    },
    default: 'pending',
  },
  approvedBySys: {
    type: Boolean,
  },
  approvedBy: [
    {
      userId: {
        type: Types.ObjectId,
        ref: 'User',
      },
      approvedAt: Date,
      status: String,
      comment: String,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

type IWithdrawal = InferSchemaType<typeof withdrawalSchema>;
// withdrawalSchema.pre(/^find/, function (this: Query<{}, IWithdrawal>) {
//   this.populate({ path: 'approveBy.userId' });
// });

export default model('Withdrawal', withdrawalSchema);
