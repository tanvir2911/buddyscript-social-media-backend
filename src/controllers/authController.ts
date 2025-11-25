import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, getCurrentUser } from '../services/authService';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const { token, user } = await registerUser(first_name, last_name, email, password);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.json({
      message: 'Login successful',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId as number;
    const user = await getCurrentUser(userId);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};


