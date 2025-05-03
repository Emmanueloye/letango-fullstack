import { Request, Response } from 'express';
import PersonalTransaction from './personalTransModel';
import axios from 'axios';
import statusCodes from '../../errors/statusCodes';
import crypto from 'crypto';
import AppError from '../../errors';

export const initializeTransaction = async (req: Request, res: Response) => {
  const data = {
    email: req.user.email,
    amount: req.body.contribution * 100,
    callback_url: process.env.PAYSTACK_CALLBACK_URL,
    metadata: {
      description: req.body.description,
      userId: req.user.id,
      userRef: req.user.userRef,
      transactionType: 'contribute',
    },
  };

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

  if (eventData.event === 'charge.success' && data.status === 'success') {
    await PersonalTransaction.create({
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
    });
  }

  res.status(statusCodes.OK).json({ status: 'success' });
};

export const confirmPayment = async (req: Request, res: Response) => {
  const payment = await PersonalTransaction.findOne({
    transactionRef: req.query.reference,
  });

  if (!payment) {
    throw new AppError.NotFound('No resource for this payment.');
  }
  res.status(statusCodes.OK).json({ status: 'success', payment });
};
