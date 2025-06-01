import { Request, Response } from 'express';
import { Types } from 'mongoose';
const { body } = require('express-validator');
import Group from '../group/groupModel';
import Member from '../members/memberModel';
import AppError from '../../errors';
import statusCodes from '../../errors/statusCodes';
import * as utils from '../../utils';
import * as approvalUtils from './approvalUtils';
import { factory } from 'typescript';

export const AddApprovalAuthority = async (req: Request, res: Response) => {
  // Get group
  const group = await Group.findOne({ groupRef: req.body.groupRef }).select(
    '+approvalAuthorities'
  );

  // Get membership of the approval authority.
  const member = await Member.findOne({
    groupRef: group?.groupRef,
    memberId: req.body.approvalAuthority,
  });

  // Check if there is group id for the incoming groupRef
  if (!group) {
    throw new AppError.NotFound('Invalid group.');
  }

  // Run further checks
  approvalUtils.runCheckForApprovalAuthorities({ group, member, req });

  // Push the approval update.
  group.approvalAuthorities.push(req.body.approvalAuthority);
  await group.save();

  res.status(statusCodes.OK).json({
    status: 'success',
    message: `Approval authority added to ${group.groupName} ${group.groupType}`,
  });
};

export const updateApprovalAuthority = async (req: Request, res: Response) => {
  // Get group
  const group = await Group.findOne({ groupRef: req.body.groupRef }).select(
    '+approvalAuthorities'
  );

  // Get member for the new approval authority
  const member = await Member.findOne({
    groupRef: req.body.groupRef,
    memberId: req.body.approvalAuthority,
  });

  // Run checks
  approvalUtils.runCheckForUpdatedApprovalAuthority({ member, group, req });

  // Check if group exist for the groupRef
  if (!group) {
    throw new AppError.NotFound('You cannot perform this action.');
  }

  // Get the index of the existing approval authority to be updated
  const index = group.approvalAuthorities.indexOf(
    req.body.oldApprovalAuthority
  );

  // Update the existing approval authority.
  group.approvalAuthorities.splice(index, 1, req.body.approvalAuthority);
  await group.save();
  res.status(statusCodes.OK).json({
    status: 'success',
    message: 'Approval authority updated successfully.',
  });
};

export const validateApprovalAuthority = utils.checkForErrors([
  body('groupRef').notEmpty().withMessage('Invalid group reference.'),
  body('approvalAuthority')
    .notEmpty()
    .withMessage('Approval authority field is required.'),
]);

export const validateUpdatedAuthority = utils.checkForErrors([
  body('oldApprovalAuthority')
    .notEmpty()
    .withMessage('Old approval authority field is required.')
    .custom((value: Types.ObjectId) => Types.ObjectId.isValid(value))
    .withMessage('Please provide a valid user.'),
  body('approvalAuthority')
    .notEmpty()
    .withMessage('Approval authority field is required.')
    .custom((value: Types.ObjectId) => Types.ObjectId.isValid(value))
    .withMessage('Please provide a valid user.'),
]);
