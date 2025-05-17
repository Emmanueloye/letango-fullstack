import { Router } from 'express';
import * as authMiddleware from '../../middlewares/authMiddleware';
import * as fundClassController from './fundClassController';

const router = Router();

router.route('/').get(authMiddleware.protect, fundClassController.getFundClass);

export default router;
