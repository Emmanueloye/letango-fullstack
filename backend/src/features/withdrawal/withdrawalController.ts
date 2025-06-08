import { Request, Response } from 'express';
import Group from '../group/groupModel';
import FundClass from '../groupExpenseHead/FundClassificationModel';
import Withdrawal from './withdrawalModel';
import GroupTransaction from '../transactions/groupTransactionModel';
import statusCodes from '../../errors/statusCodes';
import AppError from '../../errors';
import { startSession } from 'mongoose';
import { checkForErrors, generateUniqueId } from '../../utils';
import GetRequestAPI, { paginateDetails } from '../../utils/getRequestAPI';
const { body } = require('express-validator');

export const validateWithdrawal = checkForErrors([
  body('amount').notEmpty().withMessage('Amount field is required.'),
  body('to').notEmpty().withMessage('Receiver name field is required.'),
  body('bank').notEmpty().withMessage('Receiver bank field is required.'),
  body('head').notEmpty().withMessage('Expense head field is required.'),
  body('accountNumber')
    .notEmpty()
    .withMessage('Receiver account field is required.'),
  body('description').notEmpty().withMessage('Description field is required.'),
]);

// Handler to create/place withdrawal
export const createWithdrawal = async (req: Request, res: Response) => {
  // Get info from body: to-Receiving account name
  const { groupRef, to, amount, head, bank, description, accountNumber } =
    req.body;

  // To start mongoose session
  const session = await startSession();

  // Get group and fund head relating to the withdrawal
  const group = await Group.findOne({ groupRef });
  const fundHead = await FundClass.findById(head);

  // Get existing pending withdrawals if available.
  const existingWithdrawals = await Withdrawal.find({
    groupRef,
    approvalStatus: 'pending',
  });

  // Calculate pending withdrawals to avoid over drawing of balance.
  const pendingWithdrawals = existingWithdrawals.reduce(
    (acc, cur) => acc + cur.contribution,
    0
  );

  // Check that amount to be withdrawn is not more than balance less pending withdrawals.
  if (amount > group!.groupBalance - pendingWithdrawals) {
    throw new AppError.BadRequest('Insufficient balance.');
  }

  // Run these codes if we have approval authorities
  if (group && group?.approvalAuthorities?.length > 0) {
    // Get approval authorities id in an array.
    const groupAuthorities = group.approvalAuthorities.map((authority) =>
      authority._id.toString()
    );

    // Check to ensure that withdrawal requester is not part of approval authority for control purpose.
    if (groupAuthorities.includes(req.user.id)) {
      throw new AppError.UnAuthorized(
        'You cannot be part of the approval authorities and also be a requester. You can either update the approval authority or let someone else place the withdrawal.'
      );
    }

    // create withdrawal and put it in approval workflow.
    await Withdrawal.create({
      groupRef,
      requester: req.user.id,
      from: groupRef,
      fromGroup: group?._id,
      to,
      contribution: amount,
      bank,
      description,
      accountNumber,
      head: fundHead?.head,
      headType: fundHead?.headType,
      approvedBySys: false,
      approvedBy: [
        {
          userId: groupAuthorities.at(0),
          status: 'pending',
        },
      ],
    });

    // Respond to user and return.
    res.status(statusCodes.OK).json({
      status: 'success',
      message:
        'Withdrawal has been placed successfully. Please, expect your account to be credited within 24hours after the withdrawal is approved by the group approval authority(ies).',
    });
    return;
  }

  // Run these codes if there is no approval authorities. i.e it enters automatic approval.
  if (group && group?.approvalAuthorities?.length === 0) {
    // Initiate session
    await session.withTransaction(async () => {
      // Create withdrawal
      await Withdrawal.create(
        [
          {
            groupRef,
            requester: req.user.id,
            from: groupRef,
            fromGroup: group?._id,
            to,
            bank,
            description,
            accountNumber,
            contribution: amount,
            head: fundHead?.head,
            headType: fundHead?.headType,
            approvedBySys: true,
            approvalStatus: 'approve',
          },
        ],
        { session }
      );

      // Drop the withdrawal in the group transaction
      await GroupTransaction.create(
        [
          {
            groupRef,
            from: groupRef,
            to,
            fromGroup: group._id,
            transactionRef: `TRAN-${generateUniqueId(5)}`.toUpperCase(),
            contribution: amount * -1,
            bank,
            description,
            accountNumber,
            head: fundHead?.head,
            headType: fundHead?.headType,
            transactionType: 'withdrawal',
          },
        ],
        { session }
      );

      group.groupBalance += amount * -1;
      await group.save({ session });

      res.status(statusCodes.OK).json({
        status: 'success',
        message:
          'Withdrawal has been placed successfully. Please, expect your account to be credited within 24hours.',
      });
      return;
    });
  }
  throw new AppError.BadRequest('Sorry, we cannot handle your request.');
};

// Get withdrawal based on status and logged in user.
export const getGroupPendingWithdrawals = async (
  req: Request,
  res: Response
) => {
  // Get group reference and withdrawal status from user via query params.
  const { groupRef, approvalStatus } = req.query;

  // Check if the groupRef and approvalStatus are set in the params, otherwise, we throw error.
  if (!groupRef || !approvalStatus) {
    throw new AppError.BadRequest(
      'Your request is invalid. Please, try again.'
    );
  }

  // Get all the withdrawal that matches the group, where approval status matches the incoming status (pending|reject|approve), approvedBy.userId matches the logged in user and populate the approveBy.

  const getFeatures = new GetRequestAPI(Withdrawal.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .limitDocuments()
    .paginate();

  const withdrawals = await getFeatures.query.populate({
    path: 'approvedBy.userId',
    select: 'surname otherNames',
  });

  const queryReq = new GetRequestAPI(Withdrawal.find(), req.query)
    .filter()
    .sort()
    .limitFields();

  const documentCount = await queryReq.query.countDocuments();

  let page;
  if (req.query.page) page = paginateDetails(documentCount, req);

  // Respond to user
  res.status(statusCodes.OK).json({
    status: 'success',
    noHits: withdrawals.length,
    page,
    withdrawals,
  });
};

export const approveWithdrawal = async (req: Request, res: Response) => {
  // Get groupRef and status
  const { groupRef, status, comment } = req.body;

  // create a session
  const session = await startSession();

  // Throw error if there is no groupRef and status update
  if (!status) {
    throw new AppError.BadRequest('Please select action.');
  }

  if (!groupRef) {
    throw new AppError.BadRequest('Invalid request. Please try again later.');
  }

  // Get the group
  const group = await Group.findOne({ groupRef });
  // Get the withdrawal
  const withdrawal = await Withdrawal.findById(req.params.id);
  // get the approval authorities ids in an array
  const approvalAuthorities = group?.approvalAuthorities.map((item) =>
    item._id.toString()
  );

  // check if there is value for withdrawals
  if (!withdrawal) {
    throw new AppError.NotFound('No resource for your request on our server.');
  }

  // get the approvedBy pending on the currently logged in user.
  const currentApproval = withdrawal?.approvedBy.find(
    (item) => (item?.userId as any)._id.toString() === req.user.id.toString()
  );

  // If there is none, that means the user have no access or the approval is not pending with the current user.
  if (!currentApproval) {
    throw new AppError.UnAuthorized('You cannot perform this action.');
  }

  // Check if the approval have been done before
  if (currentApproval?.status === 'approve') {
    throw new AppError.BadRequest(
      'This withdrawal has already been approved by you.'
    );
  }

  // Get the currentIndex of the approval authorities as we contraining the approval to go inline with the approval authorities in group arrangement.
  const currentIndex = approvalAuthorities?.indexOf(req.user.id);

  // If user input is approve, run this code
  if (status === 'approve') {
    // checking that the current index + 1 is still within approvalAuths lengths. With this we know that there is more approvals required.
    if (currentIndex! + 1 < approvalAuthorities!.length) {
      // Set the withdrawal approval values and push in new approval to the workflow.
      withdrawal.approvedBy[currentIndex!].status = status;
      withdrawal.approvedBy![currentIndex!].approvedAt = new Date(Date.now());
      withdrawal.approvedBy![currentIndex!].comment = comment;
      // Push new approval authority to the workflow.
      withdrawal.approvedBy.push({
        userId: approvalAuthorities![currentIndex! + 1],
        status: 'pending',
      });
      await withdrawal.save();
    }

    // If current index plus 1 is same as the length of approval authorities, At this point, we know this is the final approval. We want to create the transaction for the withdrawal.
    if (currentIndex! + 1 === approvalAuthorities?.length) {
      await session.withTransaction(async () => {
        withdrawal.approvedBy[currentIndex!].status = status;
        withdrawal.approvedBy![currentIndex!].approvedAt = new Date(Date.now());
        withdrawal.approvedBy![currentIndex!].comment = comment;
        withdrawal.approvalStatus = 'approve';
        await withdrawal.save({ session });

        // Drop the withdrawal in the group transaction
        await GroupTransaction.create(
          [
            {
              groupRef,
              from: groupRef,
              to: withdrawal.to,
              fromGroup: group?._id,
              transactionRef: `TRAN-${generateUniqueId(5)}`,
              contribution: withdrawal.contribution * -1,
              bank: withdrawal.bank,
              description: withdrawal.description,
              head: withdrawal?.head,
              headType: withdrawal?.headType,
              transactionType: 'withdrawal',
            },
          ],
          { session }
        );

        group!.groupBalance += withdrawal.contribution * -1;
        await group!.save({ session });
      });
    }

    if (currentIndex! + 1 > approvalAuthorities!.length) {
      throw new AppError.BadRequest(
        'Approval is completed for this withdrawal.'
      );
    }
    res
      .status(statusCodes.OK)
      .json({ status: 'success', message: 'withdrawal has been approved.' });
    return;
  }

  // If there is rejection from any approval authority, the approval work flow stops there.
  if (status === 'reject') {
    if (!comment) {
      throw new AppError.BadRequest('Please state rejection reason.');
    }

    withdrawal.approvedBy[currentIndex!].status = status;
    withdrawal.approvedBy[currentIndex!].comment = comment;
    withdrawal.approvedBy![currentIndex!].approvedAt = new Date(Date.now());
    withdrawal.approvalStatus = 'reject';
    await withdrawal.save();
    res
      .status(statusCodes.OK)
      .json({ status: 'success', message: 'withdrawal has been rejected.' });
    return;
  }
  throw new AppError.BadRequest('We could not handle your request.');
};
