import { Router } from 'express';
import * as approvalController from './approvalController';
import * as authMiddleware from '../../middlewares/authMiddleware';
import { checkAdmin } from '../members/memberController';
// import { checkMembership } from '../members/memberController';
const router = Router();

router
  .route('/')
  .post(
    authMiddleware.protect,
    approvalController.validateApprovalAuthority,
    checkAdmin,
    approvalController.AddApprovalAuthority
  );

router
  .route('/update')
  .post(
    authMiddleware.protect,
    approvalController.validateUpdatedAuthority,
    checkAdmin,
    approvalController.updateApprovalAuthority
  );

export default router;
