import { Router } from 'express';
import * as userController from './userController';
import * as authMiddleware from '../../middlewares/authMiddleware';
import * as validate from './userValidation';

const router = Router();

router
  .route('/')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin', 'admin'),
    userController.getUsers
  );

router
  .route('/me')
  .get(authMiddleware.protect, userController.setUserId, userController.getMe)
  .patch(
    authMiddleware.protect,
    userController.setUserId,
    userController.uploadUserPhoto,
    userController.processImage,
    userController.updateMe
  );

router
  .route('/update-password')
  .patch(
    authMiddleware.protect,
    validate.validatePasswordUpdate,
    userController.updateUserPassword
  );

router
  .route('/:id')
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin', 'admin'),
    userController.getUser
  )
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('super-admin', 'admin'),
    userController.updateUser
  );

export default router;
