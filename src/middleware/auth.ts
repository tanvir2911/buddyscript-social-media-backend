import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError';

export interface AuthRequest extends Request {
  userId?: number;
  user?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export const authenticateToken = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError('Access token required', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      userId: number;
      email: string;
      first_name: string;
      last_name: string;
    };

    req.userId = decoded.userId;
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      first_name: decoded.first_name,
      last_name: decoded.last_name,
    };
    return next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', 403));
  }
};

