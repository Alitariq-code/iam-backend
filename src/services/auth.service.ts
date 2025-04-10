import db from '../database/db.js';
import bcrypt from 'bcrypt';
import { User, UserResponse } from '../models/user.model.js';

/**
 * Hashes the provided plaintext password.
 */
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Creates a new user and returns a safe user object without sensitive information.
 */
export const createUser = async (
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    password: string
  ): Promise<UserResponse> => {
    const hashedPassword = await hashPassword(password);
  
    const [user] = await db('users')
      .insert({
        username,
        email,
        first_name,
        last_name,
        password: hashedPassword,
      })
      .returning<UserResponse[]>(['id', 'username', 'email', 'first_name', 'last_name', 'created_at']);
  
    return user;
  };

/**
 * Retrieves a user from the database based on username.
 */
export const findUserByUsername = async (
  username: string
): Promise<User | undefined> => {
  return db<User>('users')
    .where({ username })
    .first();
};

/**
 * Compares plaintext password to hashed password, returns boolean result.
 */
export const verifyPassword = async (
  plaintextPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plaintextPassword, hashedPassword);
};
