import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded; // if you're not using custom types yet
    next();
  } catch (error) {
    res.status(403).json({
      status: 'error',
      message: 'Invalid or expired token',
    });
  }
};
