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
  .route('/admin')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin', 'admin'),
    withdrawalController.adminGetWithdrawals
  );

router
  .route('/admin/:id')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin', 'admin'),
    withdrawalController.adminGetWithdrawal
  )
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin', 'admin'),
    withdrawalController.adminUpdateWithdrawal
  );

router
  .route('/:id')
  .patch(
    authMiddleware.protect,
    checkAdmin,
    withdrawalController.approveWithdrawal
  );

export default router;
