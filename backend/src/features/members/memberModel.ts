import { InferSchemaType, model, Query, Schema, Types } from 'mongoose';

const memberSchema = new Schema({
  memberId: {
    type: Types.ObjectId, //user id of the member
    ref: 'User',
    required: true,
  },
  memberName: {
    type: String,
    required: true,
    lowercase: true,
  },
  groupId: {
    type: Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  groupRef: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: {
      values: ['member', 'admin', 'owner'],
    },
  },
  admittedBy: {
    type: Types.ObjectId,
    ref: 'User',
  },
  admittedDate: {
    type: Date,
  },
  unadmitBy: {
    type: Types.ObjectId,
    ref: 'User',
  },
  unadmitDate: {
    type: Date,
  },
  status: {
    type: Boolean,
    default: false,
  },
  joinedAt: {
    type: Date,
    default: Date.now(),
  },
});

type IMember = InferSchemaType<typeof memberSchema>;

memberSchema.pre(/^find/, function (this: Query<{}, IMember>) {
  this.populate({ path: 'groupId' })
    .populate({
      path: 'memberId',
      select: 'surname otherNames',
    })
    .populate({ path: 'admittedBy', select: 'surname otherNames' })
    .populate({ path: 'unadmitBy', select: 'surname otherNames' });
});

export default model('Member', memberSchema);
