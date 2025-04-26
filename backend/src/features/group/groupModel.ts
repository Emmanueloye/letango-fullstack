import { model, Schema, Types } from 'mongoose';

const groupSchema = new Schema({
  groupName: {
    type: String,
    required: [true, 'Group name field is required.'],
  },
  groupType: {
    type: String,
    required: [true, 'Group type field is required.'],
  },
  groupPurpose: {
    type: String,
    required: [true, 'Group purpose field is required.'],
  },
  groupLogo: {
    type: String,
  },
  groupLogoPublicId: String,
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
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model('Group', groupSchema);
