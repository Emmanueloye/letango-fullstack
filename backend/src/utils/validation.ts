import * as AppError from '../errors/appError';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
const { param } = require('express-validator');

// const { body, param, validationResult } = expressValidator;

export const checkForErrors = (validations: any, errType = 400) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // sequential processing, stops running validations chain if one fails.
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        const errorMsg = result
          .array()
          .map((val: { msg: any }) => val.msg)
          .join(',');
        throw new AppError.BadRequest(errorMsg);
      }
    }

    next();
  };
};

// export const checkForErrors = (validatedInputs: any, errType = 400) => {
//   return [
//     validatedInputs,
//     (req: Request, res: Response, next: NextFunction) => {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         if (errType === 400) {
//           const errMsg = errors
//             .array()
//             .map((val) => val.msg)
//             .join(',');
//           throw new AppError.BadRequest(errMsg);
//         }
//         if (errType === 401) {
//           const errMsg = errors
//             .array()
//             .map((val) => val.msg)
//             .join(',');
//           throw new AppError.Unauthenticated(errMsg);
//         }
//       }
//       next();
//     },
//   ];
// };

export const validateParams = checkForErrors([
  param('id')
    .custom((value: Types.ObjectId) => Types.ObjectId.isValid(value))
    .withMessage('No page found for the requested id'),
]);
