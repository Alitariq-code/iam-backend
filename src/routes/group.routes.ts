import express from 'express';
import {
  listGroups,
  getGroup,
  createNewGroup,
  updateGroupById,
  removeGroup,
  addUsersToGroup,
} from '../controllers/group.controller.js';

import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/', listGroups);
router.get('/:id', getGroup);
router.post('/', createNewGroup);
router.put('/:id', updateGroupById);
router.delete('/:id', removeGroup);

// Assign users to group
router.post('/:groupId/users', addUsersToGroup);

export default router;
