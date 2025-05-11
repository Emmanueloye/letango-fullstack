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

interface TransactionModel extends Model<ITransaction> {
  calcBalance: (userRef: string) => void;
  calcInflow: (userRef: string) => void;
  calcOutflow: (userRef: string) => void;
}
// Calculate personal wallet balance
// personalTransactionSchema.statics.calcBalance = async function (userRef) {
//   const metrics = await this.aggregate([
//     { $match: { userRef: userRef } },
//     {
//       $group: {
//         _id: '$userRef',
//         balance: { $sum: '$contribution' },
//       },
//     },
//   ]);

//   // Save the balance in user database.
//   await User.findOneAndUpdate(
//     { userRef },
//     {
//       personalWallet: metrics?.at(0)?.balance || 0,
//     },
//     { new: true }
//   );
// };

// // Update the personal wallet balance on save
// personalTransactionSchema.post('save', function () {
//   const model = this.constructor as TransactionModel;

//   model.calcBalance(this.userRef as string);
// });

// Calculate monthly inflow on save
// personalTransactionSchema.statics.calcInflow = async function (userRef) {
//   const metrics = await this.aggregate([
//     {
//       $addFields: {
//         documentMonth: { $month: '$createdAt' },
//         monthDate: { $month: new Date() },
//       },
//     },
//     {
//       // Match the document the added fields
//       $match: { $expr: { $eq: ['$documentMonth', '$monthDate'] } },
//     },
//     { $match: { contribution: { $gt: 0 } } },
//     { $match: { userRef: userRef } },

//     {
//       $group: {
//         _id: '$userRef',
//         inflow: { $sum: '$contribution' },
//       },
//     },
//   ]);

//   // Save the balance in user database.
//   await User.findOneAndUpdate(
//     { userRef },
//     {
//       inflow: metrics?.at(0)?.inflow || 0,
//     },
//     { new: true }
//   );
// };

// // Update monthly inflow on save
// personalTransactionSchema.post('save', function () {
//   const model = this.constructor as TransactionModel;
//   model.calcInflow(this.userRef as string);
// });

// Calculate monthly outflow on save
// personalTransactionSchema.statics.calcOutflow = async function (userRef) {
//   const metrics = await this.aggregate([
//     {
//       $addFields: {
//         documentMonth: { $month: '$createdAt' },
//         monthDate: { $month: new Date() },
//       },
//     },
//     {
//       // Match the document the added fields
//       $match: { $expr: { $eq: ['$documentMonth', '$monthDate'] } },
//     },
//     { $match: { contribution: { $lt: 0 } } },
//     { $match: { userRef: userRef } },

//     {
//       $group: {
//         _id: '$userRef',
//         outflow: { $sum: '$contribution' },
//       },
//     },
//   ]);

//   // Save the balance in user database.
//   await User.findOneAndUpdate(
//     { userRef },
//     {
//       outflow: metrics?.at(0)?.outflow || 0,
//     },
//     { new: true }
//   );
// };

// Update monthly inflow on save
// personalTransactionSchema.post('save', function () {
//   const model = this.constructor as TransactionModel;
//   model.calcOutflow(this.userRef as string);
// });

export default model('PersonalTransaction', personalTransactionSchema);
