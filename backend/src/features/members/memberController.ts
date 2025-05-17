import Member from './memberModel';
import * as factory from '../../utils/handlerFactory';
import { Request, Response } from 'express';
import statusCodes from '../../errors/statusCodes';

export const getUserGroup = async (req: Request, res: Response) => {
  const userGroups = await Member.find({ memberId: req.user.id });
  res.status(statusCodes.OK).json({ status: 'success', userGroups });
};
