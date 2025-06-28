import { Router } from 'express';
import * as groupReportController from './groupReportController';
import * as authMiddleware from '../../middlewares/authMiddleware';
import { checkMembership } from '../members/memberController';
import { switchDate } from '../transactions/transactionController';

const router = Router();

router
  .route('/statement')
  .get(
    authMiddleware.protect,
    switchDate,
    checkMembership,
    groupReportController.statement
  );

router
  .route('/income-expense')
  .get(
    authMiddleware.protect,
    switchDate,
    checkMembership,
    groupReportController.incomeAndExpense
  );

router
  .route('/contributions')
  .get(
    authMiddleware.protect,
    switchDate,
    checkMembership,
    groupReportController.contributionReport
  );

export default router;
