import { Router } from 'express';
import * as authMiddleware from '../../middlewares/authMiddleware';
import * as fundClassController from './fundClassController';
import { checkAdmin, checkMembership } from '../members/memberController';

const router = Router();

router
  .route('/')
  .get(
    authMiddleware.protect,
    checkMembership,
    fundClassController.getFundClass
  )
  .post(
    authMiddleware.protect,
    fundClassController.validateCreateHead,
    checkAdmin,
    fundClassController.createFunHead
  );

router
  .route('/:id')
  .get(authMiddleware.protect, checkAdmin, fundClassController.getFundHead)
  .patch(
    authMiddleware.protect,
    checkAdmin,
    fundClassController.updateFundHead
  );

export default router;
