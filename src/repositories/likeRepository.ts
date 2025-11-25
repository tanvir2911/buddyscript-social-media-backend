import { prisma } from '../lib/prisma';

export const findPostLike = async (postId: number, userId: number) => {
  return prisma.postLike.findUnique({
    where: {
      postId_userId: { postId, userId },
    },
  });
};

export const addPostLike = async (postId: number, userId: number) => {
  await prisma.postLike.create({
    data: { postId, userId },
  });
};

export const removePostLike = async (postId: number, userId: number) => {
  await prisma.postLike.delete({
    where: {
      postId_userId: { postId, userId },
    },
  });
};

export const findCommentLike = async (commentId: number, userId: number) => {
  return prisma.commentLike.findUnique({
    where: {
      commentId_userId: { commentId, userId },
    },
  });
};

export const addCommentLike = async (commentId: number, userId: number) => {
  await prisma.commentLike.create({
    data: { commentId, userId },
  });
};

export const removeCommentLike = async (commentId: number, userId: number) => {
  await prisma.commentLike.delete({
    where: {
      commentId_userId: { commentId, userId },
    },
  });
};

export const findReplyLike = async (replyId: number, userId: number) => {
  return prisma.replyLike.findUnique({
    where: {
      replyId_userId: { replyId, userId },
    },
  });
};

export const addReplyLike = async (replyId: number, userId: number) => {
  await prisma.replyLike.create({
    data: { replyId, userId },
  });
};

export const removeReplyLike = async (replyId: number, userId: number) => {
  await prisma.replyLike.delete({
    where: {
      replyId_userId: { replyId, userId },
    },
  });
};


