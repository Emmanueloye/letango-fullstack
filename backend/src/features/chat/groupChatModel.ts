import { InferSchemaType, model, Query, Schema, Types } from 'mongoose';

const groupChatSchema = new Schema(
  {
    groupId: {
      type: Types.ObjectId,
      ref: 'Group',
    },
    groupRef: String,
    sender: {
      type: Types.ObjectId,
      ref: 'User',
    },
    senderName: String,
    content: {
      type: String,
      required: [true, 'Message field is required.'],
    },
    likesCount: Number,
    dislikesCount: Number,
  },
  { timestamps: true }
);

type IChat = InferSchemaType<typeof groupChatSchema>;

groupChatSchema.pre(/^find/, function (this: Query<{}, IChat>) {
  this.populate({ path: 'sender', select: 'surname otherNames photo' });
});

export default model('GroupChat', groupChatSchema);
