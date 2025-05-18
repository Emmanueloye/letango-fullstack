const { body, check } = require('express-validator');
import { Request } from 'express';

// const { body } = require('express-validator');
import * as utils from '../../utils';

export const validateInitTransaction = utils.checkForErrors([
  body('contribution')
    .notEmpty()
    .withMessage('Contribution amount field is required.'),
  body('description')
    .notEmpty()
    .withMessage('Contribution description field is required.'),
  check('fundClass')
    .if(
      (value: any, { req }: { req: Request }) =>
        req.body.fundClass !== undefined
    )
    .notEmpty()
    .withMessage('Purpose of payment field is required.'),
]);
