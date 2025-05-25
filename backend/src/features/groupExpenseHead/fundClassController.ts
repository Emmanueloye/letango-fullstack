import { Request, Response } from 'express';
import * as factory from '../../utils/handlerFactory';
import * as utils from '../../utils';
import GetRequestAPI from '../../utils/getRequestAPI';
import FundClass from './FundClassificationModel';
const { body } = require('express-validator');

// To create a new fund heads/class for club and association
export const createFunHead = factory.createOne({
  Model: FundClass,
  label: 'fundHead',
  excludedFields: ['isActive'],
});

export const validateCreateHead = utils.checkForErrors([
  body('head').notEmpty().withMessage('Fund head field is required.'),
  body('headType').notEmpty().withMessage('Head type field is required.'),
]);

// To get all fund heads for club and association.
export const getFundClass = factory.getAll({
  Model: FundClass,
  label: 'fundClasses',
});

export const getFundHead = factory.getOne({
  Model: FundClass,
  label: 'fundHead',
});

// To update fund heads for club and association.
export const updateFundHead = factory.updateOne({
  Model: FundClass,
  label: 'fundHead',
  includedFields: ['head', 'headType', 'isActive'],
});

// To delete fund heads for club and association.
// export const deleteFundHead = factory.deleteOne({
//   Model: FundClass,
//   label: 'fundHead',
// });
