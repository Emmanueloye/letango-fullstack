import { Router } from 'express';
import * as personalTranController from './personalController';
import * as authMiddleware from '../../middlewares/authMiddleware';
import * as validate from './validateTransaction';

const router = Router();

router
  .route('/')
  .post(
    authMiddleware.protect,
    validate.validateInitTransaction,
    personalTranController.initializeTransaction
  );

router.route('/webhook').post(personalTranController.verifyPayment);

router
  .route('/confirm')
  .get(authMiddleware.protect, personalTranController.confirmPayment);

export default router;
