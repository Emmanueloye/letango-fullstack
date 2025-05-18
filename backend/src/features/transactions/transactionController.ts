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
  if (req.body.contribution <= 999) {
    throw new AppError.BadRequest('Contribution cannot be less than NGN1.');
  }

  let callBackLink;
  let data;

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
    // console.log(error);

    res.status(error.status).json({
      status: 'fail',
      message: error.message,
    });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  // Based on the initialization request, an event is emitted back to the server which is handled in verify checkout handler.
  let eventData;

  const hash = crypto
    .createHmac('sha512', `${process.env.PAYSTACK_API_SECRET}`)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash === req.headers['x-paystack-signature']) {
    eventData = req.body;
  }

  const data = eventData.data;

  // console.log(data);

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
    console.log(data.metadata.type);

    // This handles group contribution
    if (data.metadata.type === 'group') {
      try {
        const group = await Group.findOne({ groupRef: data.metadata.groupRef });
        console.log(group);

        if (!group) {
          throw new AppError.NotFound('Group not found');
        }

        await session.withTransaction(async () => {
          const xyz = await GroupTransaction.create(
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
export const confirmPayment = async (req: Request, res: Response) => {
  const payment = await PersonalTransaction.findOne({
    transactionRef: req.query.reference,
  });

  if (!payment) {
    throw new AppError.NotFound('No resource for this payment.');
  }
  res.status(statusCodes.OK).json({ status: 'success', payment });
};

// To confirm group payment to user
export const confirmGroupPayment = async (req: Request, res: Response) => {
  const payment = await GroupTransaction.findOne({
    transactionRef: req.query.reference,
  });

  if (!payment) {
    throw new AppError.NotFound('No resource for this payment.');
  }
  res.status(statusCodes.OK).json({ status: 'success', payment });
};

export const switchDate = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.startDate) req.body.startDate = req.query.startDate;
  if (!req.body.endDate) req.body.endDate = req.query.endDate;

  next();
};

// Generates customers statement
export const customerStatement = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.body;
  if (startDate > endDate) {
    throw new AppError.BadRequest(
      'End date cannot be earlier than the start date.'
    );
  }

  const lastDate: Date = utils.lastDate(endDate);

  const priorDateData = await PersonalTransaction.find({
    userRef: req.user.userRef,
    createdAt: { $gte: new Date('2025-01-01'), $lte: startDate },
  });

  const openingBal = priorDateData.reduce((acc, curr) => {
    return acc + curr.contribution;
  }, 0);

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
