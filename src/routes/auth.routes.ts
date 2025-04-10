import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { registerValidationRules, validateRequest,loginValidationRules } from '../middleware/validation.middleware.js';

const router = Router();

router.post('/register', registerValidationRules(), validateRequest, register);
router.post('/login', loginValidationRules(), validateRequest, login);

export default router;
