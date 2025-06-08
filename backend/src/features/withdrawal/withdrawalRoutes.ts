import { Router } from 'express';
import * as withdrawalController from './withdrawalController';
import * as authMiddleware from '../../middlewares/authMiddleware';
import { checkAdmin, checkMembership } from '../members/memberController';

const router = Router();

router
  .route('/')
  .post(
    authMiddleware.protect,
    withdrawalController.validateWithdrawal,
    checkAdmin,
    withdrawalController.createWithdrawal
  )
  .get(
    authMiddleware.protect,
    checkMembership,
    withdrawalController.getGroupPendingWithdrawals
  );

router
  .route('/:id')
  .patch(authMiddleware.protect, withdrawalController.approveWithdrawal);

export default router;
