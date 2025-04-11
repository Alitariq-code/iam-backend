import express from 'express';
import {
  listUsers,
  getUser,
  editUser,
  removeUser,
} from '../controllers/user.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { checkPermission } from '../middleware/permission.middleware.js';

const router = express.Router();

router.use(authenticateJWT);
router.get('/', checkPermission('Users', 'read') , listUsers);
router.get('/:id',checkPermission('Users', 'create'), getUser);
router.put('/:id',checkPermission('Users', 'update'), editUser);
router.delete('/:id',checkPermission('Users', 'delete'), removeUser);

export default router;
