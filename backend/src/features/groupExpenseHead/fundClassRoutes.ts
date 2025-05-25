import { Router } from 'express';
import * as authMiddleware from '../../middlewares/authMiddleware';
import * as fundClassController from './fundClassController';
import { checkAdmin } from '../members/memberController';

const router = Router();

router
  .route('/')
  .get(authMiddleware.protect, checkAdmin, fundClassController.getFundClass)
  .post(
    authMiddleware.protect,
    fundClassController.validateCreateHead,
    checkAdmin,
    fundClassController.createFunHead
  );

export default router;
