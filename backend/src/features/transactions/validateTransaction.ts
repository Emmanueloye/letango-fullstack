const { body } = require('express-validator');
// const { body } = require('express-validator');
import * as utils from '../../utils';

export const validateInitTransaction = utils.checkForErrors([
  body('contribution')
    .notEmpty()
    .withMessage('Contribution amount field is required.'),
  body('description')
    .notEmpty()
    .withMessage('Contribution description field is required.'),
]);
