import { InferSchemaType, model, Query, Schema, Types } from 'mongoose';

const groupSchema = new Schema({
  groupRef: {
    type: String,
    required: true,
  },
  groupName: {
    type: String,
    required: [true, 'Group name field is required.'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  groupType: {
    type: String,
    required: [true, 'Group type field is required.'],
  },
  groupPurpose: {
    type: String,
    required: [true, 'Group purpose field is required.'],
  },
  photo: {
    type: String,
  },
  photoPublicId: String,
  groupDescription: {
    type: String,
    required: [true, 'Group description field is required.'],
  },
  owner: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  groupBalance: {
    type: Number,
    default: 0,
  },
  approvalAuthorities: {
    type: [Types.ObjectId],
    ref: 'User',
    select: false,
  },
  approvalLimit: {
    type: Number,
    default: 3,
  },
  memberLimit: {
    type: Number,
    default: 20,
  },
  subscription: {
    type: String,
    enum: ['basic', 'bronze', 'gold'],
  },
  startDate: Date,
  endDate: Date,
  groupCode: {
    type: String,
    unique: true,
  },
  isActive: { type: Boolean, default: true },
  reason: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export type IGroup = InferSchemaType<typeof groupSchema>;

groupSchema.pre(/^find/, function (this: Query<{}, IGroup>) {
  this.populate({
    path: 'approvalAuthorities',
    select: 'surname otherNames email',
  }).populate({ path: 'owner', select: 'surname otherNames' });
});

export default model<IGroup>('Group', groupSchema);
