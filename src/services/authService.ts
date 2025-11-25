import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { AppError } from '../errors/AppError';
import { createUser, findUserByEmail, findUserById } from '../repositories/userRepository';

const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
const jwtExpiresIn = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

export const registerUser = async (firstName: string, lastName: string, email: string, password: string) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new AppError('User already exists', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser(firstName, lastName, email, hashedPassword);

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );

  return {
    token,
    user: {
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      created_at: user.createdAt,
    },
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user || !user.password) {
    throw new AppError('Invalid credentials', 401);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );

  return {
    token,
    user: {
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
    },
  };
};

export const getCurrentUser = async (userId: number) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return {
    id: user.id,
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    created_at: user.createdAt,
  };
};


