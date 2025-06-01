import { NextFunction, Request, Response } from 'express';
import PersonalTransaction from './personalTransModel';
import GroupTransaction from './groupTransactionModel';
import User from '../users/userModel';
import Group from '../group/groupModel';
import Fund from '../groupExpenseHead/FundClassificationModel';
import axios from 'axios';
import statusCodes from '../../errors/statusCodes';
import crypto from 'crypto';
import AppError from '../../errors';
import * as utils from '../../utils';
import * as factory from '../../utils/handlerFactory';
import { startSession } from 'mongoose';

export const initializeTransaction = async (req: Request, res: Response) => {
  // reject request if contribution is not up to NGN1000
  if (req.body.contribution <= 999) {
    throw new AppError.BadRequest('Contribution cannot be less than NGN1.');
  }

  // To switch call back link depending on the type of contribution.
  let callBackLink;
  // To switch data depending on the type of contribution
  let data;

  // For personal wallet contribution
  if (req.body.type === 'personal') {
    callBackLink = process.env.PAYSTACK_CALLBACK_URL;

    data = {
      email: req.user.email,
      amount: req.body.contribution * 100,
      callback_url: callBackLink,
      metadata: {
        description: req.body.description,
        userId: req.user.id,
        userRef: req.user.userRef,
        transactionType: 'contribute',
        type: req.body.type,
      },
    };
  }

  // For group contribution
  if (req.body.type === 'group') {
    callBackLink = `${process.env.BASE_URL}/account/manage-group/view/${req.body.groupRef}/contribute/confirm`;

    const fundClass = await Fund.findById(req.body.fundClass);

    data = {
      email: req.user.email,
      amount: req.body.contribution * 100,
      callback_url: callBackLink,
      metadata: {
        description: req.body.description,
        userId: req.user.id,
        userRef: req.user.userRef,
        groupRef: req.body.groupRef,
        transactionType: 'contribute',
        type: req.body.type,
        head: fundClass?.head,
        headType: fundClass?.headType,
      },
    };
  }

  // Send request to paystack
  try {
    const url = `${process.env.PAYSTACK_BASE_URL}/transaction/initialize`;
    const result = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_API_SECRET}`,
        'Content-Type': 'application/json',
      },
    });

    // Destructure the required data from the response received from the api.
    const { authorization_url } = result.data.data;
    // Send back to the user
    res.status(statusCodes.OK).json({
      status: 'success',
      redirectURL: authorization_url,
    });
  } catch (error: any) {
    res.status(error.status).json({
      status: 'fail',
      message: error.message,
    });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  // Based on the initialization request, an event is emitted back to the server which is handled in verify checkout handler.
  let eventData;

  // Verify that the incoming request is from paystack
  const hash = crypto
    .createHmac('sha512', `${process.env.PAYSTACK_API_SECRET}`)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash === req.headers['x-paystack-signature']) {
    eventData = req.body;
  }

  const data = eventData.data;

  // Initiate a session for atomicity
  const session = await startSession();

  if (eventData.event === 'charge.success' && data.status === 'success') {
    // This handles personal wallet contribution
    if (data.metadata.type === 'personal') {
      try {
        const user = await User.findOne({ userRef: data.metadata.userRef });
        if (!user) {
          throw new AppError.NotFound('User not found');
        }

        await session.withTransaction(async () => {
          await PersonalTransaction.create(
            [
              {
                userRef: data.metadata.userRef,
                from: data.metadata.userRef,
                to: data.metadata.userRef,
                fromId: data.metadata.userId,
                toId: data.metadata.userId,
                transactionRef: data.reference,
                contribution: data.amount / 100,
                bank: data.authorization.bank,
                channel: data.channel,
                transactionId: data.id,
                description: data.metadata.description,
                transactionType: data.metadata.transactionType,
                fee: data.fees / 100,
                createdAt: Date.now(),
              },
            ],
            { session }
          );

          user.personalWallet += data.amount / 100;
          user.inflow += data.amount / 100;
          await user.save({ session });
        });
        res.status(statusCodes.OK).json({ status: 'success' });
      } catch (error: any) {
        throw new Error(error.message);
      }
    }

    // This handles group contribution
    if (data.metadata.type === 'group') {
      try {
        const group = await Group.findOne({ groupRef: data.metadata.groupRef });

        if (!group) {
          throw new AppError.NotFound('Group not found');
        }

        await session.withTransaction(async () => {
          await GroupTransaction.create(
            [
              {
                groupRef: data.metadata.groupRef,
                from: data.metadata.userRef,
                to: data.metadata.groupRef,
                fromId: data.metadata.userId,
                toId: group._id,
                transactionRef: data.reference,
                contribution: data.amount / 100,
                bank: data.authorization.bank,
                channel: data.channel,
                transactionId: data.id,
                description: data.metadata.description,
                head: data?.metadata?.head,
                headType: data?.metadata?.headType,
                transactionType: data.metadata.transactionType,
                fee: data.fees / 100,
                createdAt: Date.now(),
              },
            ],
            { session }
          );

          group.groupBalance += data.amount / 100;

          await group.save({ session });
        });
        res.status(statusCodes.OK).json({ status: 'success' });
      } catch (error: any) {
        throw new Error(error.message);
      }
    }
  }
};

// To confirm payment made to personal wallet
export const confirmPersonalPayment = factory.getOne({
  Model: PersonalTransaction,
  label: 'payment',
  queryKey: 'transactionRef',
  paramKey: 'reference',
});

// To confirm group payment to user
export const confirmGroupPayment = factory.getOne({
  Model: GroupTransaction,
  label: 'payment',
  queryKey: 'transactionRef',
  paramKey: 'reference',
});

export const switchDate = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.startDate) req.body.startDate = req.query.startDate;
  if (!req.body.endDate) req.body.endDate = req.query.endDate;

  next();
};

// Generates customers statement
export const customerStatement = async (req: Request, res: Response) => {
  // get incoming dates
  const { startDate, endDate } = req.body;
  // Ensures that endate is not lower than start date
  if (startDate > endDate) {
    throw new AppError.BadRequest(
      'End date cannot be earlier than the start date.'
    );
  }

  // Reformat end date
  const lastDate: Date = utils.lastDate(endDate);

  // Transactions from beginning till start date to calculate opening balance
  const priorDateData = await PersonalTransaction.find({
    userRef: req.user.userRef,
    createdAt: { $gte: new Date('2025-01-01'), $lte: startDate },
  });

  // Calculation of opening balance
  const openingBal = priorDateData.reduce((acc, curr) => {
    return acc + curr.contribution;
  }, 0);

  // Get transactions within the start and end date
  const statement = await PersonalTransaction.find({
    userRef: req.user.userRef,
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
