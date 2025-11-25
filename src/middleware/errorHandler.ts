import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
  }

  console.error('Unexpected error:', err);
  return res.status(500).json({
    error: 'Something went wrong',
  });
};


