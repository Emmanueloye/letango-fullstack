import { Router } from 'express';
import * as transactionController from './transactionController';
import * as authMiddleware from '../../middlewares/authMiddleware';
import * as validate from './validateTransaction';
import { validateDate } from '../groupReport/groupReportController';

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
  .get(authMiddleware.protect, transactionController.confirmPersonalPayment);

router
  .route('/group-confirm')
  .get(authMiddleware.protect, transactionController.confirmGroupPayment);

router
  .route('/statement')
  .get(
    authMiddleware.protect,
    transactionController.switchDate,
    validateDate,
    transactionController.customerStatement
  );

export default router;
