import { model, Schema, Types } from 'mongoose';

const logSchema = new Schema({
  requester: {
    type: Types.ObjectId, //requester's id
    ref: 'User',
  },
  action: {
    type: String,
    enum: {
      values: ['read', 'view', 'create', 'update', 'delete'],
    },
  },
  change: String, // which routes/collection queried by the user action
  // changeMade: [String], //What field is impacted with the action taken.
  targetGroup: {
    type: Types.ObjectId,
    ref: 'Group',
  },
  targetUser: {
    type: Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model('Log', logSchema);
