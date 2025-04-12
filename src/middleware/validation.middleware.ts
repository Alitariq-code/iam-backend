import { createRequire } from 'module';
import { Request, Response } from 'express';
const require = createRequire(import.meta.url);
const { body, validationResult } = require('express-validator');

export const registerValidationRules = (): any[] => [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const loginValidationRules = (): any[] => [
  body('username')
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Error handler middleware
export const validateRequest = (
  req: Request,
  res: Response,
  next: any
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let message = errors.array().map((err: any) => ({
      field: err.param,
      message: err.msg,
    }))
    res.status(400).json({
      status: 'error',
      message: message[0]?.message,

      errors: errors.array().map((err: any) => ({
        field: err.param,
        message: err.msg,
      })),
    });
    return;
  }
  next();
};