import { Request, Response } from 'express';
import GroupChat from './groupChatModel';
import ChatReaction from './chatReactionModel';
import * as factory from '../../utils/handlerFactory';
import { socketIo } from '../../server';
import AppError from '../../errors';
import statusCodes from '../../errors/statusCodes';

// Handler to create a new chat
export const createChat = async (req: Request, res: Response) => {
  const { groupId, groupRef, content } = req.body;
  const chat = await GroupChat.create({
    groupId,
    groupRef,
    content,
    sender: req.user.id,
    senderName: `${req.user.surname} ${req.user.otherNames}`,
  });

  socketIo.to(groupRef).emit('receivedChat', chat);

  res.status(201).json({ status: 'success', chat });
};

// Handler to get all chats.
export const getChats = factory.getAll({ Model: GroupChat, label: 'chats' });

// Controller to handle chat update.
export const updateChat = async (req: Request, res: Response) => {
  const chat = await GroupChat.findById(req.params.id);

  if (!chat) {
    throw new AppError.NotFound('No chat found.');
  }

  const { like, ...others } = req.body;
  let likesCount;

  const chatReaction = await ChatReaction.findOne({
    userId: req.user.id,
    chatId: chat._id,
  });

  if (chatReaction) {
    likesCount = chat.likesCount -= 1;

    await chatReaction.deleteOne();
  }

  if (!chatReaction) {
    likesCount = chat.likesCount += 1;
    await ChatReaction.create({
      userId: req.user.id,
      chatId: chat._id,
      reaction: 'like',
    });
  }

  const body = { ...others, likesCount };

  const updatedChat = await GroupChat.findByIdAndUpdate(chat._id, body, {
    new: true,
    runValidators: true,
  });

  socketIo.to(chat.groupRef as string).emit('updatedChat', updatedChat);

  // socketIo.to(groupRef).emit('receivedChat', chat);

  res.status(statusCodes.OK).json({ status: 'success', updatedChat });
};
