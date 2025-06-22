import { Request, Response } from 'express';
import AppError from '../../errors';
import * as utils from '../../utils';
import GroupTransaction from '../transactions/groupTransactionModel';
import statusCodes from '../../errors/statusCodes';

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

  console.log(lastDate);

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
