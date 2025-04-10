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

const router = express.Router();

router.use(authenticateJWT);

router.get('/', listRoles);
router.get('/:id', getRole);
router.post('/', createNewRole);
router.put('/:id', updateRoleById);
router.delete('/:id', removeRole);
router.post('/groups/:groupId/roles', addRolesToGroup);

export default router;
