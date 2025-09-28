import { Router } from 'express';
import * as groupSettingController from './groupSettingController';
import * as authMiddleware from '../../middlewares/authMiddleware';

const router = Router();

router
  .route('/')
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    groupSettingController.createGroupSettings
  )
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    groupSettingController.getGroupSettings
  );

router
  .route('/:id')
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    groupSettingController.updateGroupSetting
  );

export default router;
