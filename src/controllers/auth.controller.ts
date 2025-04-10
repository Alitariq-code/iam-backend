import { Request, Response } from 'express';
import { createUser, findUserByUsername, verifyPassword } from '../services/auth.service.js';
import { generateToken } from '../utils/generateToken.js';

/**
 * Handles user registration
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, email, first_name, last_name, password } = req.body;
  
      // Validate input
      if (!username || !email || !first_name || !last_name || !password) {
        res.status(400).json({
          status: 'error',
          message: 'All fields are required.',
        });
        return;
      }
  
      // Check if username or email already exists
      const existingUser = await findUserByUsername(username);
      if (existingUser) {
        res.status(409).json({ status: 'error', message: 'Username is already taken.' });
        return;
      }
  
      // Create user
      const user = await createUser(username, email, first_name, last_name, password);
  
      const token = generateToken(user.id);
  
      res.status(201).json({
        status: 'success',
        message: 'User registered successfully.',
        token,
        user,
      });
    } catch (error) {
      console.error('❌ Registration Error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Unexpected error occurred during registration.',
        details: (error as Error).message,
      });
    }
  };
  

/**
 * Handles user login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
      res.status(400).json({
        status: 'error',
        message: 'Username and password are required.',
      });
      return;
    }

    // Find user by username
    const user = await findUserByUsername(username);
    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found.',
      });
      return;
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid credentials.',
      });
      return;
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Send success response
    res.status(200).json({
      status: 'success',
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An unexpected error occurred during login.',
      details: (error as Error).message,
    });
  }
};
