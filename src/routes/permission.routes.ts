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

const router = express.Router();
router.use(authenticateJWT);

router.get('/', listPermissions);
router.get('/:id', getPermission);
router.post('/', createNewPermission);
router.put('/:id', updatePermissionById);
router.delete('/:id', removePermission);
router.post('/roles/:roleId/permissions', addPermissionsToRole);

router.get('/me/permissions', getMyPermissions);
router.post('/simulate-action', simulateAction);

export default router;
