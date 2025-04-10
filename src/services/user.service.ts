import db from '../database/db.js';
import { User, UserResponse } from '../models/user.model.js';

export const getAllUsers = async (): Promise<UserResponse[]> => {
  return db<User>('users')
    .select('id', 'username', 'email', 'first_name', 'last_name', 'created_at');
};

export const getUserById = async (id: number): Promise<UserResponse | undefined> => {
  return db<User>('users')
    .select('id', 'username', 'email', 'first_name', 'last_name', 'created_at')
    .where({ id })
    .first();
};

export const updateUser = async (
  id: number,
  data: Partial<Omit<User, 'id' | 'password'>>
): Promise<UserResponse | undefined> => {
  const [updated] = await db<User>('users')
    .where({ id })
    .update({ ...data, updated_at: new Date() })
    .returning(['id', 'username', 'email', 'first_name', 'last_name', 'created_at']);
  return updated;
};

export const deleteUser = async (id: number): Promise<number> => {
  return db<User>('users').where({ id }).delete();
};

  
