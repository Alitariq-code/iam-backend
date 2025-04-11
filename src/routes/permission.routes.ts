import express from 'express';
import {
  listPermissions,
  getPermission,
  createNewPermission,
  updatePermissionById,
  removePermission,
  addPermissionsToRole,
  simulateAction,
  getMyPermissions
} from '../controllers/permission.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { checkPermission } from '../middleware/permission.middleware.js';

const router = express.Router();
router.use(authenticateJWT);

router.get('/',checkPermission('Permissions', 'read'), listPermissions);
router.get('/:id',checkPermission('Permissions', 'read'), getPermission);
router.post('/',checkPermission('Permissions', 'create'), createNewPermission);
router.put('/:id',checkPermission('Permissions', 'update'), updatePermissionById);
router.delete('/:id',checkPermission('Permissions', 'delete'), removePermission);
router.post('/roles/:roleId/permissions',checkPermission('Permissions', 'update'), addPermissionsToRole);

router.get('/me/permissions', getMyPermissions);
router.post('/simulate-action', simulateAction);

export default router;
