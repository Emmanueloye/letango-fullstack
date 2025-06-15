import { Router } from 'express';
import * as chatController from './chatController';
import * as authMiddleware from '../../middlewares/authMiddleware';
import { checkMembership } from '../members/memberController';

const router = Router();

router
  .route('/')
  .post(authMiddleware.protect, checkMembership, chatController.createChat)
  .get(authMiddleware.protect, checkMembership, chatController.getChats);

router.route('/:id').patch(authMiddleware.protect, chatController.updateChat);

export default router;
