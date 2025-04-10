import express from 'express';
import {
  listUsers,
  getUser,
  editUser,
  removeUser,
} from '../controllers/user.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateJWT);
router.get('/', listUsers);
router.get('/:id', getUser);
router.put('/:id', editUser);
router.delete('/:id', removeUser);

export default router;
