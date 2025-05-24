import { Router } from 'express';
import * as memberController from './memberController';
import * as authMiddleware from '../../middlewares/authMiddleware';

const router = Router();

router.route('/').get(authMiddleware.protect, memberController.getUserGroups);

router
  .route('/group-members')
  .get(
    authMiddleware.protect,
    memberController.checkMembership,
    memberController.getGroupMembers
  );

router
  .route('/:id')
  .get(authMiddleware.protect, memberController.getUserGroup)
  .patch(
    authMiddleware.protect,
    memberController.checkAdmin,
    memberController.updateMember
  );

export default router;
