import { model, Schema, Types } from 'mongoose';

const fundClassSchema = new Schema({
  groupRef: {
    type: String,
    required: true,
  },
  groupId: {
    type: Types.ObjectId,
    ref: 'Group',
  },
  head: {
    type: String,
    required: [true, 'head field is required.'],
  },
  headType: {
    type: String,
    required: [true, 'Head type field is required.'],
    enum: {
      values: ['income', 'expense'],
      message: 'Input for head type not valid',
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model('FundClass', fundClassSchema);
