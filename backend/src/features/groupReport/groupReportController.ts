import { Request, Response } from 'express';
import AppError from '../../errors';
import * as utils from '../../utils';
import GroupTransaction from '../transactions/groupTransactionModel';
import Member from '../members/memberModel';
import FundClass from '../groupExpenseHead/FundClassificationModel';
import statusCodes from '../../errors/statusCodes';
const { body } = require('express-validator');

// To generate group statement
export const statement = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.body;

  if (startDate > endDate) {
    throw new AppError.BadRequest(
      'End date cannot be earlier than the start date.'
    );
  }

  const lastDate = utils.lastDate(endDate);

  // Transactions from beginning till start date to calculate opening balance
  const priorDateData = await GroupTransaction.find({
    groupRef: req.query.groupRef,
    createdAt: { $gte: new Date('2025-01-01'), $lte: startDate },
  });

  // Calculation of opening balance
  const openingBal = priorDateData.reduce(
    (acc, curr) => acc + curr.contribution,
    0
  );

  // Get transactions within the start and end date
  const statement = await GroupTransaction.find({
    groupRef: req.query.groupRef,
    createdAt: { $gte: new Date(startDate), $lte: lastDate },
  });

  res.status(statusCodes.OK).json({
    status: 'success',
    openingBal,
    noHits: statement.length,
    statement,
    date: { startDate, endDate },
  });
};

// Handler to generate income and expenses report
export const incomeAndExpense = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.body;
  if (startDate > endDate) {
    throw new AppError.BadRequest(
      'End date cannot be earlier than the start date.'
    );
  }

  const lastDate = utils.lastDate(endDate);

  const incomeExpense = await GroupTransaction.aggregate([
    {
      $match: {
        groupRef: req.query.groupRef,
      },
    },
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(lastDate),
        },
      },
    },

    {
      $group: {
        _id: { head: '$head', headType: '$headType' },
        amount: { $sum: '$contribution' },
      },
    },
  ]);
  res.status(statusCodes.OK).json({ status: 'success', incomeExpense });
};

// Handler for generating members contribution report
export const contributionReport = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.body;
  if (startDate > endDate) {
    throw new AppError.BadRequest(
      'End date cannot be earlier than the start date.'
    );
  }

  const lastDate = utils.lastDate(endDate);

  // Get all income head for group
  const incomeHeads = await FundClass.find({
    groupRef: req.query.groupRef,
    headType: 'income',
  });

  // Extract the income head for each group
  const incomeMap = incomeHeads.reduce((acc, head) => {
    acc[head.head] = head.head;
    return acc;
  }, {} as Record<string, string>);

  const incomeHeadNames = Object.values(incomeMap); //[subscription, donation, etc]

  // Get all members in the group
  const members = await Member.find({ groupRef: req.query.groupRef });

  // get transactions
  const transactions = await GroupTransaction.find({
    groupRef: req.query.groupRef,
    createdAt: { $gte: startDate, $lte: lastDate },
    headType: 'income',
  });

  const summaryMap: any = {};

  // Initialize each member
  for (const member of members) {
    summaryMap[(member.memberId as any)?._id.toString()] = {
      memberName: `${(member?.memberId as any)?.surname} ${
        (member?.memberId as any)?.otherNames?.split(' ')[0]
      }`,
    };

    for (const name of incomeHeadNames) {
      summaryMap[(member.memberId as any)?._id.toString()][name] = 0;
    }
  }

  // populate transaction values
  for (const txn of transactions) {
    const incomeHeadName = incomeMap[txn?.head as string];

    if (!incomeHeadName) continue; // skip if income head isn't found

    const memberId = (txn?.fromId as any)?._id.toString?.();

    if (!memberId) continue;

    // Add to the specific income head
    summaryMap[memberId][incomeHeadName] += txn?.contribution;
  }

  // Convert to array
  const result = Object.values(summaryMap);

  res
    .status(statusCodes.OK)
    .json({ status: 'success', noHits: result.length, contributions: result });
};

export const validateDate = utils.checkForErrors([
  body('startDate').notEmpty().withMessage('Start date is required'),
  body('endDate').notEmpty().withMessage('End date is required'),
]);
