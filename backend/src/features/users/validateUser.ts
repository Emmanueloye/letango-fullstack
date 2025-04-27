import { checkForErrors, validateParams } from '../../utils';
const { body } = require('express-validator');

export const validateSignUp = checkForErrors([
  body('surname').notEmpty().withMessage('Surname field is required.'),
  body('otherNames').notEmpty().withMessage('Other names field is required.'),
  body('email').notEmpty().withMessage('Email field is required.'),
  body('password').notEmpty().withMessage('Password field is required.'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password field is required.'),
]);

export const validateLogin = checkForErrors([
  body('email').notEmpty().withMessage('Email field is required.'),
  body('password').notEmpty().withMessage('Password field is required.'),
]);

export const validateVerifyOTP = checkForErrors([
  body('email')
    .notEmpty()
    .withMessage('Invalid credentials for one-time login code.'),
  body('token')
    .notEmpty()
    .withMessage('Invalid credentials for one-time login code.'),

  body('loginOTP').notEmpty().withMessage('One-time login code is required.'),
]);

export const validateForgetPassword = checkForErrors([
  body('email').notEmpty().withMessage('Email field is required.'),
]);

export const validateResetPassword = checkForErrors([
  body('email')
    .notEmpty()
    .withMessage(
      'Invalid reset password credentials. Try the reset process again.'
    ),
  body('token')
    .notEmpty()
    .withMessage(
      'Invalid reset password credentials. Try the reset process again.'
    ),
  body('password').notEmpty().withMessage('New password field is required.'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password field is required.'),
]);
