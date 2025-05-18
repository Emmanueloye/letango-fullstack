import { Router } from 'express';
import * as groupTransactController from './groupTransactionController';
import * as authMiddleware from '../../middlewares/authMiddleware';

const router = Router();

router
  .route('/')
  .get(authMiddleware.protect, groupTransactController.getTransactions);

export default router;
