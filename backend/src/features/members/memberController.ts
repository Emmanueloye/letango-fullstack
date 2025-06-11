import Member from './memberModel';
import * as factory from '../../utils/handlerFactory';
import { NextFunction, Request, Response } from 'express';
import statusCodes from '../../errors/statusCodes';
import AppError from '../../errors';
import GetRequestAPI, { paginateDetails } from '../../utils/getRequestAPI';

// Get group that the currently logged in user belongs to.
export const getUserGroups = async (req: Request, res: Response) => {
  const filter = { memberId: req.user.id };
  const getFeatures = new GetRequestAPI(Member.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .limitDocuments()
    .paginate();

  const userGroups = await getFeatures.query;

  const queryReq = new GetRequestAPI(Member.find(filter), req.query)
    .filter()
    .sort()
    .limitFields();

  const documentCount = await queryReq.query.countDocuments();
  let page;
  if (req.query.page) page = paginateDetails(documentCount, req);
  // const userGroups = await Member.find({
  //   memberId: req.user.id,
  //   status: true,
  // });
  res
    .status(statusCodes.OK)
    .json({ status: 'success', noHits: userGroups.length, page, userGroups });
};

// Get membership details for a specific group and user.
export const getUserGroup = async (req: Request, res: Response) => {
  const member = await Member.findOne({
    memberId: req.user.id,
    groupRef: req.params.id,
    status: true,
  });
  if (!member) {
    throw new AppError.NotFound(
      'Please check your status with the group admin.'
    );
  }
  res.status(statusCodes.OK).json({ status: 'success', member });
};

// Get all members that belongs to a specific group.
export const getGroupMembers = factory.getAll({
  Model: Member,
  label: 'members',
  queryKeys: ['groupRef'],
  values: ['groupRef'],
});

export const updateMember = factory.updateOne({
  Model: Member,
  label: 'member',
  includedFields: ['status', 'role'],
  // queryKey: 'memberId',
  log: true,
});

// Middleware function checking that only member can view member list.
export const checkMembership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const member = await Member.findOne({
    groupRef: req.body.groupRef ? req.body.groupRef : req.query.groupRef,
    memberId: req.user._id,
    status: true,
  });

  if (!member) {
    throw new AppError.UnAuthorized(
      'Your request cannot be handled by our server.'
    );
  }

  next();
};

// Middleware function checking that only member with owner and admin right can modify key group information.
export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const member = await Member.findOne({
    groupRef: req.body.groupRef ? req.body.groupRef : req.query.groupRef,
    memberId: req.user._id,
    status: true,
  });

  // Check if the currently logged in user is a member
  if (!member) {
    throw new AppError.UnAuthorized(
      'Your request cannot be handled by our server.'
    );
  }

  // Checked if the currently logged in user has the group admin right.
  if (!['admin', 'owner'].includes(member?.role as string)) {
    throw new AppError.UnAuthorized(
      'Your request cannot be handled by our server.'
    );
  }

  next();
};
