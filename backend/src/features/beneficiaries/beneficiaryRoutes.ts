import { Router } from 'express';
import * as authMiddleware from '../../middlewares/authMiddleware';
import * as beneficiaryController from './beneficiaryController';

const router = Router();

router
  .route('/')
  .post(
    authMiddleware.protect,
    beneficiaryController.setUserDetails,
    beneficiaryController.validateBeneficiary,
    beneficiaryController.saveBeneficiary
  )
  .get(authMiddleware.protect, beneficiaryController.getMyBeneficiaries);

router
  .route('/:id')
  .delete(authMiddleware.protect, beneficiaryController.deleteBeneficiaries);

export default router;
