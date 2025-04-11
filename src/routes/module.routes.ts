import express from 'express';
import {
  listModules,
  getModule,
  createNewModule,
  updateModuleById,
  removeModule,
} from '../controllers/module.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { checkPermission } from '../middleware/permission.middleware.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/', checkPermission('Modules', 'read'),listModules);
router.get('/:id',checkPermission('Modules', 'read'), getModule);
router.post('/',	checkPermission('Modules', 'create'), createNewModule);
router.put('/:id',checkPermission('Modules', 'update'), updateModuleById);
router.delete('/:id',checkPermission('Modules', 'delete'), removeModule);

export default router;
