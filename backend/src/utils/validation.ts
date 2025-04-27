import * as AppError from '../errors/appError';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
const { param, validationResult } = require('express-validator');

export const checkForErrors = (validatedInputs: any, errType = 400) => {
  return [
    validatedInputs,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        if (errType === 400) {
          const errMsg = errors
            .array()
            .map((val: { msg: string }) => val.msg)
            .join(',');
          throw new AppError.BadRequest(errMsg);
        }
        if (errType === 401) {
          const errMsg = errors
            .array()
            .map((val: { msg: string }) => val.msg)
            .join(',');
          throw new AppError.Unauthenticated(errMsg);
        }
      }
      next();
    },
  ];
};

export const validateParams = checkForErrors([
  param('id')
    .custom((value: Types.ObjectId) => Types.ObjectId.isValid(value))
    .withMessage('No page found for the requested id'),
]);
