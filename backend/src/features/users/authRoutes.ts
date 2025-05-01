import { Router } from 'express';
import * as authController from './authController';
import * as validation from './userValidation';
import * as authMiddleware from '../../middlewares/authMiddleware';
import { loginRateLimiter } from '../../middlewares/routeLimiter';

const router = Router();

router
  .route('/signup')
  .post(validation.validateSignUp, authController.createUser);

router
  .route('/verify-email')
  .post(authController.switchVerificationData, authController.verifyEmail);

router
  .route('/login')
  .post(validation.validateLogin, loginRateLimiter, authController.login);

router
  .route('/verify-OTP')
  .post(
    validation.validateVerifyOTP,
    loginRateLimiter,
    authController.verifyOTP
  );

router
  .route('/forget-password')
  .post(validation.validateForgetPassword, authController.forgetPassword);

router
  .route('/reset-password')
  .post(validation.validateResetPassword, authController.resetPassword);

router.route('/logout').delete(authMiddleware.protect, authController.logout);
export default router;
