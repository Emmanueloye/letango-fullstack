import { Request } from 'express';
import AppError from '../../errors';
import { Types } from 'mongoose';

export const runCheckForApprovalAuthorities = ({
  member,
  group,
  req,
}: {
  member: any;
  group: any;
  req: Request;
}) => {
  if (!member) {
    throw new AppError.UnAuthorized(
      'You cannot add a user that is not a member of the group as approval authority.'
    );
  }

  if (member.role === 'member') {
    throw new AppError.BadRequest(
      'Only member with the role of owner and admin can be added as approval authority.'
    );
  }

  if (group.approvalAuthorities.length === group.approvalLimit) {
    throw new AppError.UnAuthorized('Maximum approval authorities reached.');
  }

  // We are looping because with the pre find hook in the model, approval authorities is no longer array of ids but array of object with info of users added as approval authority.
  group.approvalAuthorities.forEach((item: { _id: any }) => {
    if (item._id.toString() === req.body.approvalAuthority) {
      throw new AppError.BadRequest('Approval authority already exists.');
    }
  });
};

export const runCheckForUpdatedApprovalAuthority = ({
  member,
  group,
  req,
}: {
  member: any;
  group: any;
  req: Request;
}) => {
  // Check if the new approval authority is a member.
  if (!member) {
    throw new AppError.NotFound('You cannot perform this action.');
  }

  // Check that the member has right permission to be an approval.
  if (member.role === 'member') {
    throw new AppError.BadRequest(
      'Only member with the role of owner and admin can be added as approval authority.'
    );
  }

  // We are looping because with the pre find hook in the model, approval authorities is no longer array of ids but array of object with info of users added as approval authority. This is putting all approval authorities ids in an array
  const groupAuthorities = group.approvalAuthorities.map(
    (item: { id: Types.ObjectId }) => item.id.toString()
  );

  // Check if the new approval authority exist before updating.
  if (!groupAuthorities.includes(req.body.oldApprovalAuthority)) {
    throw new AppError.BadRequest(
      'The approver authority you are trying to replace does not exist.'
    );
  }

  // Check to ensure there is no duplicated approval authority.
  if (groupAuthorities.includes(req.body.approvalAuthority)) {
    throw new AppError.BadRequest('Approval authority already exist.');
  }
};
