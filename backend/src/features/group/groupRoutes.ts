import { Router } from 'express';
import * as groupController from './groupController';
import { processImage } from '../users/userController';
import * as authMiddleware from '../../middlewares/authMiddleware';

const router = Router();

router
  .route('/')
  .post(
    authMiddleware.protect,
    groupController.uploadImage,
    groupController.processImage,
    groupController.createGroup
  );

router
  .route('/:id')
  .patch(
    authMiddleware.protect,
    groupController.uploadImage,
    groupController.processImage,
    groupController.updateGroup
  )
  .get(authMiddleware.protect, groupController.getGroup);

export default router;
