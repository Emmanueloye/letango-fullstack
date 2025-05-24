import { Request, Response } from 'express';
import { startSession } from 'mongoose';
import ShortUniqueId from 'short-unique-id';
import User from '../users/userModel';
import PersonalTransaction from './personalTransModel';
import AppError from '../../errors';
import statusCodes from '../../errors/statusCodes';
import * as utils from '../../utils';
const { body } = require('express-validator');

export const formatDate = (input: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  }).format(input);
};

export const personalTransfer = async (req: Request, res: Response) => {
  // We are only getting receiver account reference and transfer amount from request body.
  const { to, amount, description } = req.body;

  // Want to perform atomicity i.e if one operation fail, all operation fails. This starts a session for atomicity.
  const session = await startSession();

  const unid = new ShortUniqueId({ length: 7 });

  // Get the users that is currently logged in initiating the transfer.
  const from = await User.findById(req.user.id);

  // Get the user receiving the transfer
  const newTo = await User.findOne({ userRef: to });

  if (!from) {
    throw new AppError.BadRequest('User not found');
  }

  if (!newTo) {
    throw new AppError.BadRequest('User not found');
  }

  if (from.status !== 'active') {
    throw new AppError.BadRequest(
      'You cannot perform this action because your account have been suspended/banned.Please contact our support team.'
    );
  }

  // Check if the user is trying to tranfer to him/herself
  if (from?.userRef === newTo?.userRef) {
    throw new AppError.BadRequest('You Cannot transfer to yourself.');
  }

  // Check if the balance is enough to fund the transfer.
  if (amount > from!.personalWallet) {
    throw new AppError.BadRequest('Insufficient balance to fund transfer.');
  }

  try {
    // Perform the transfer operation
    await session.withTransaction(async () => {
      const reference = unid.rnd();
      // Update the sender's wallet
      const sender = await PersonalTransaction.create(
        [
          {
            userRef: req.user.userRef,
            from: req.user.userRef,
            to: newTo.userRef,
            fromId: req.user.id,
            toId: newTo.id,
            transactionRef: reference,
            contribution: amount * -1, // multiply by minus one to show withdrawal.
            description,
            transactionType: 'transfer',
          },
        ],
        { session }
      );

      //   Update receiver wallet
      const receiver = await PersonalTransaction.create(
        [
          {
            userRef: newTo.userRef,
            from: req.user.userRef,
            to: newTo.userRef,
            fromId: req.user.id,
            toId: newTo.id,
            transactionRef: reference,
            contribution: amount, // multiply by minus one to show withdrawal.
            description,
            transactionType: 'transfer',
          },
        ],
        { session }
      );

      from.personalWallet += amount * -1;
      from.outflow += amount * -1;
      await from.save({ session });

      newTo.personalWallet += Number(amount);
      newTo.inflow += Number(amount);
      await newTo.save({ session });

      const senderEmailData = {
        senderName: `Transfer to ${newTo.surname} ${newTo.otherNames}`,
        amount: new Intl.NumberFormat().format(Number(amount)),
        transactionRef: reference,
        date: formatDate(new Date(Date.now())),
        type: 'DR',
        email: from.email,
      };

      const receiverEmailDate = {
        senderName: `Transfer from ${from.surname} ${from.otherNames}`,
        amount: new Intl.NumberFormat().format(Number(amount)),
        transactionRef: reference,
        date: formatDate(new Date(Date.now())),
        type: 'CR',
        email: newTo.email,
      };

      utils.Email.sendTransactionAlert(senderEmailData);
      utils.Email.sendTransactionAlert(receiverEmailDate);

      res
        .status(statusCodes.CREATED)
        .json({ status: 'success', message: 'Transaction successful.' });
    });
  } catch (error) {
    throw new AppError.BadRequest(
      'Transaction failed. Please try again later.'
    );
  }
};

export const validateTransfer = utils.checkForErrors([
  body('to').notEmpty().withMessage('Receiving account field is required.'),
  body('amount')
    .notEmpty()
    .withMessage('Transfer amount field is required.')
    .isNumeric()
    .withMessage('Transfer amount must be a number.'),
  body('description').notEmpty().withMessage('Description field is required.'),
]);
