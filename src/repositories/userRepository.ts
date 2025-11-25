import { prisma } from '../lib/prisma';

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
    },
  });
};

export const createUser = async (firstName: string, lastName: string, email: string, password: string) => {
  return prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
    },
  });
};


