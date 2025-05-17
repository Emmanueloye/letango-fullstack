import { InferSchemaType, model, Query, Schema, Types } from 'mongoose';

const memberSchema = new Schema({
  memberId: {
    type: Types.ObjectId, //user id of the member
    ref: 'User',
    required: true,
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
      values: ['member', 'owner'],
    },
  },
  joinedAt: {
    type: Date,
    default: Date.now(),
  },
});

type IMember = InferSchemaType<typeof memberSchema>;

memberSchema.pre(/^find/, function (this: Query<{}, IMember>) {
  this.populate({ path: 'groupId' });
});

export default model('Member', memberSchema);
