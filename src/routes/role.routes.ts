// src/routes/role.routes.ts
import express from 'express';
import {
  listRoles,
  getRole,
  createNewRole,
  updateRoleById,
  removeRole,
  addRolesToGroup,
} from '../controllers/role.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { checkPermission } from '../middleware/permission.middleware.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/',checkPermission('Roles', 'read'), listRoles);
router.get('/:id',checkPermission('Roles', 'read'), getRole);
router.post('/',checkPermission('Roles', 'create'), createNewRole);
router.put('/:id',checkPermission('Roles', 'update'), updateRoleById);
router.delete('/:id',checkPermission('Roles', 'delete'), removeRole);
router.post('/groups/:groupId/roles',checkPermission('Roles', 'update'), addRolesToGroup);

export default router;
