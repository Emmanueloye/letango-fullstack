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

router
  .route('/statement')
  .post(authMiddleware.protect, personalTranController.customerStatement);

router
  .route('/:id')
  .get(authMiddleware.protect, personalTranController.getTransaction);

export default router;
