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
    required: [true, 'Head field is required.'],
    lowercase: true,
  },
  headType: {
    type: String,
    required: [true, 'Head type field is required.'],
    lowercase: true,
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

fundClassSchema.index({ head: 1, headtype: 1, groupRef: 1 }, { unique: true });

export default model('FundClass', fundClassSchema);
