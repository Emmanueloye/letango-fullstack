import { InferSchemaType } from 'mongoose';
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
  fee: Number,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

type ITransaction = InferSchemaType<typeof personalTransactionSchema>;

interface TransactionModel extends Model<ITransaction> {
  calcBalance: (userRef: string) => void;
}
// Calculate number of review and average rating and save it in product collection.
personalTransactionSchema.statics.calcBalance = async function (userRef) {
  const metrics = await this.aggregate([
    { $match: { userRef: userRef } },
    {
      $group: {
        _id: '$userRef',
        balance: { $sum: '$contribution' },
      },
    },
  ]);

  // [{ _id: 'FRK59RPF', balance: 10000 }];

  await User.findOneAndUpdate(
    { userRef },
    {
      personalWallet: metrics?.at(0)?.balance || 0,
    },
    { new: true }
  );
};

// Update the calculation on create/save
personalTransactionSchema.post('save', function () {
  const model = this.constructor as TransactionModel;
  model.calcBalance(this.userRef as string);
});

// // Update the calculation on update.
// personalTransactionSchema.pre('findOneAndUpdate', async function () {
//   // Get the currently updated document and pass it to the post middleware.
//   (this as any).review = await this.model.findOne(this.getQuery());
// });

// personalTransactionSchema.post('findOneAndUpdate', async function () {
//   await (this as any).review.constructor.calcReviewMetrics(
//     (this as any).review.product
//   );
// });

// // Update the calculation on delete
// personalTransactionSchema.post(
//   'deleteOne',
//   { document: true, query: false },
//   function () {
//     const model = this.constructor as ReviewModel;
//     model.calcReviewMetrics(this.product as Types.ObjectId);
//   }
// );

export default model('PersonalTransaction', personalTransactionSchema);
