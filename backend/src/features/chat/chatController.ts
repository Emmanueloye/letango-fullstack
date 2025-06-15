import { Request, Response } from 'express';
import GroupChat from './groupChatModel';
import * as factory from '../../utils/handlerFactory';
import { socketIo } from '../../server';
import AppError from '../../errors';
import statusCodes from '../../errors/statusCodes';

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

export const getChats = factory.getAll({ Model: GroupChat, label: 'chats' });

// Controller to handle chat update.
export const updateChat = async (req: Request, res: Response) => {
  const chat = await GroupChat.findById(req.params.id);

  if (!chat) {
    throw new AppError.NotFound('No chat found.');
  }

  chat.likesCount += req.body.like;
  chat.dislikesCount + req.body.dislike;
  await chat.save();
  res.status(statusCodes.OK).json({ status: 'success' });
};
