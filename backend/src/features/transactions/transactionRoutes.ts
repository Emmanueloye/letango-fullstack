import { Router } from 'express';
import * as transactionController from './transactionController';
import * as authMiddleware from '../../middlewares/authMiddleware';
import * as validate from './validateTransaction';

const router = Router();

router
  .route('/')
  .post(
    authMiddleware.protect,
    validate.validateInitTransaction,
    transactionController.initializeTransaction
  );

router.route('/webhook').post(transactionController.verifyPayment);

router
  .route('/confirm')
  .get(authMiddleware.protect, transactionController.confirmPayment);

router
  .route('/group-confirm')
  .get(authMiddleware.protect, transactionController.confirmGroupPayment);

router
  .route('/statement')
  .get(
    authMiddleware.protect,
    transactionController.switchDate,
    transactionController.customerStatement
  );

export default router;
