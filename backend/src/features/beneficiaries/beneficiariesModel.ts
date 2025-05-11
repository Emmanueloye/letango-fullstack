import { model, Schema, Types } from 'mongoose';

const beneficiarySchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
  },
  userRef: {
    type: String,
  },
  accountRef: {
    type: String,
    required: [true, 'Account reference field is required.'],
  },
  accountName: {
    type: String,
    required: [true, 'Account name field is required.'],
  },
});

export default model('Beneficiary', beneficiarySchema);
