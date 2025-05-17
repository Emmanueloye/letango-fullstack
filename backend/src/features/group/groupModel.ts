import { InferSchemaType, model, Schema, Types } from 'mongoose';

const groupSchema = new Schema({
  groupRef: {
    type: String,
    required: true,
  },
  groupName: {
    type: String,
    required: [true, 'Group name field is required.'],
    unique: true,
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
  },
  groupCode: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export type IGroup = InferSchemaType<typeof groupSchema>;

export default model<IGroup>('Group', groupSchema);
