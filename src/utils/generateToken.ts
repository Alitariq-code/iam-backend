import jwt from 'jsonwebtoken';

export const generateToken = (userId: number): string => {
  const payload = { id: userId };
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
};
