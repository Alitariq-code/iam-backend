import { Request, Response } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../services/user.service.js';

export const listUsers = async (_req: Request, res: Response) => {
  const users = await getAllUsers();
  res.json({ status: 'success', users });
};

export const getUser = async (req: Request, res: Response):Promise<any> => {
  const user = await getUserById(Number(req.params.id));
  if (!user) {
    return res.status(404).json({ status: 'error', message: 'User not found.' });
  }
  res.json({ status: 'success', user });
};

export const editUser = async (req: Request, res: Response):Promise<any>  => {
  const updated = await updateUser(Number(req.params.id), req.body);
  if (!updated) {
    return res.status(404).json({ status: 'error', message: 'User not found.' });
  }
  res.json({ status: 'success', message: 'User updated.', user: updated });
};

export const removeUser = async (req: Request, res: Response):Promise<any>  => {
  const deleted = await deleteUser(Number(req.params.id));
  if (!deleted) {
    return res.status(404).json({ status: 'error', message: 'User not found.' });
  }
  res.json({ status: 'success', message: 'User deleted.' });
};
