import { Router } from 'express';
import * as memberController from './memberController';
import * as authMiddleware from '../../middlewares/authMiddleware';

const router = Router();

router.route('/').get(authMiddleware.protect, memberController.getUserGroup);

export default router;
