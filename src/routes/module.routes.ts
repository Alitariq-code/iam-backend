import express from 'express';
import {
  listModules,
  getModule,
  createNewModule,
  updateModuleById,
  removeModule,
} from '../controllers/module.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/', listModules);
router.get('/:id', getModule);
router.post('/', createNewModule);
router.put('/:id', updateModuleById);
router.delete('/:id', removeModule);

export default router;
