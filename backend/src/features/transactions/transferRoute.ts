import { Router } from 'express';
import * as authMiddleware from '../../middlewares/authMiddleware';
import * as transferController from './transferController';

const router = Router();

router
  .route('/')
  .post(
    authMiddleware.protect,
    transferController.validateTransfer,
    transferController.personalTransfer
  );

export default router;
