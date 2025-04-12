import express from 'express';
import {
  listGroups,
  getGroup,
  createNewGroup,
  updateGroupById,
  removeGroup,
  addUsersToGroup,
  removeUserFromGroup
} from '../controllers/group.controller.js';
import { checkPermission } from '../middleware/permission.middleware.js';

import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/', checkPermission('Groups', 'read'), listGroups);
router.get('/:id',checkPermission('Groups', 'read'), getGroup);
router.post('/',checkPermission('Groups', 'create'), createNewGroup);
router.put('/:id',checkPermission('Groups', 'update'), updateGroupById);
router.delete('/:id',checkPermission('Groups', 'delete'), removeGroup);

// Assign users to group
router.post('/:groupId/users',checkPermission('Groups', 'update'), addUsersToGroup);
router.delete('/:groupId/users/:userId', checkPermission('Groups', 'update'), removeUserFromGroup);

export default router;
