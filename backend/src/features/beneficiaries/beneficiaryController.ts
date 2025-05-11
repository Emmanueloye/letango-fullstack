import Beneficiary from './beneficiariesModel';
import User from '../users/userModel';
import * as factory from '../../utils/handlerFactory';
import { NextFunction, Request, Response } from 'express';
import { checkForErrors } from '../../utils';
import AppError from '../../errors';
import statusCodes from '../../errors/statusCodes';
const { body } = require('express-validator');

export const saveBeneficiary = async (req: Request, res: Response) => {
  const { accountRef, userId, userRef } = req.body;

  //   Get user with the incoming account reference
  const userAccount = await User.findOne({ userRef: accountRef.toUpperCase() });

  const currentbeneficiary = await Beneficiary.findOne({ userRef, accountRef });

  //   If user account is not found, throw error
  if (!userAccount) {
    throw new AppError.BadRequest('Invalid account reference.');
  }

  //   If the incoming user reference is the same as that of user account, throw error.
  if (userAccount.userRef === userRef.toUpperCase()) {
    throw new AppError.BadRequest('You cannot save yourself as beneficiary.');
  }

  if (currentbeneficiary) {
    throw new AppError.BadRequest('Beneficiary already exists.');
  }

  //   Save beneficiary.
  const beneficiary = await Beneficiary.create({
    userId,
    userRef,
    accountRef,
    accountName: `${userAccount?.surname} ${userAccount?.otherNames}`,
  });

  res.status(statusCodes.CREATED).json({ status: 'success', beneficiary });
};

export const getMyBeneficiaries = async (req: Request, res: Response) => {
  const beneficiaries = await Beneficiary.find({ userRef: req.user.userRef });

  res.status(statusCodes.OK).json({ status: 'success', beneficiaries });
};

export const deleteBeneficiaries = factory.deleteOne({
  Model: Beneficiary,
  label: 'beneficiary',
});

export const validateBeneficiary = checkForErrors([
  body('accountRef')
    .notEmpty()
    .withMessage('Account reference field is required.'),
  body('accountName').notEmpty().withMessage('Account Name field is required.'),
]);

// Middleware to set user id and user reference on the request body.
export const setUserDetails = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.userId) req.body.userId = req.user.id;
  if (!req.body.userRef) req.body.userRef = req.user.userRef;
  next();
};
