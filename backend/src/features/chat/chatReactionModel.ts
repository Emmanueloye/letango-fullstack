import { model, Schema, Types } from 'mongoose';

const chatReactionSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
    },
    chatId: {
      type: Types.ObjectId,
      ref: 'GroupChat',
    },
    reaction: String,
  },
  { timestamps: true }
);

chatReactionSchema.index({ userId: 1, chatId: 1 }, { unique: true });

export default model('ChatReaction', chatReactionSchema);
