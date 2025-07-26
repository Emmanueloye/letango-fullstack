import { Router } from 'express';
import * as groupController from './groupController';
import { processImage } from '../users/userController';
import * as authMiddleware from '../../middlewares/authMiddleware';
import { checkAdmin } from '../members/memberController';

const router = Router();

router
  .route('/')
  .post(
    authMiddleware.protect,
    groupController.uploadImage,
    groupController.processImage,
    groupController.createGroup
  )
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin', 'admin'),
    groupController.getGroups
  );

router.route('/join').post(authMiddleware.protect, groupController.joinGroup);

router
  .route('/admin/:id')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    groupController.getAdminGroups
  );

router
  .route('/admin/:id')
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin', 'admin'),
    groupController.uploadImage,
    groupController.processImage,
    groupController.adminUpdateGroup
  );

router
  .route('/:id')
  .patch(
    authMiddleware.protect,
    // checkAdmin,
    authMiddleware.checkGroupResource,
    groupController.uploadImage,
    groupController.processImage,
    groupController.updateGroup
  )
  .get(authMiddleware.protect, groupController.getGroup);

export default router;
