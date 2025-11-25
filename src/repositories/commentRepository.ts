import { prisma } from '../lib/prisma';

const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
};

const toUserResponse = (user: { id: number; firstName: string; lastName: string; email: string }) => ({
  id: user.id,
  first_name: user.firstName,
  last_name: user.lastName,
  email: user.email,
});

const mapUserResponse = (user: { id: number; firstName: string; lastName: string; email: string }) => ({
  id: user.id,
  first_name: user.firstName,
  last_name: user.lastName,
  email: user.email,
});

export const getCommentsWithStats = async (postId: number, userId: number) => {
  const comments = await prisma.comment.findMany({
    where: { postId },
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      user: { select: userSelect },
      commentLikes: {
        select: {
          userId: true,
          user: { select: userSelect },
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      },
      replies: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
          user: { select: userSelect },
          replyLikes: {
            select: {
              userId: true,
              user: { select: userSelect },
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return comments.map((comment) => ({
    id: comment.id,
    post_id: postId,
    user_id: comment.userId,
    content: comment.content,
    created_at: comment.createdAt.toISOString(),
    updated_at: comment.updatedAt.toISOString(),
    first_name: comment.user.firstName,
    last_name: comment.user.lastName,
    email: comment.user.email,
    like_count: comment.commentLikes.length,
    is_liked: comment.commentLikes.some((like) => like.userId === userId),
    liked_by: comment.commentLikes.map((like) => mapUserResponse(like.user)),
    replies: comment.replies.map((reply) => ({
      id: reply.id,
      comment_id: comment.id,
      user_id: reply.userId,
      content: reply.content,
      created_at: reply.createdAt.toISOString(),
      updated_at: reply.updatedAt.toISOString(),
      first_name: reply.user.firstName,
      last_name: reply.user.lastName,
      email: reply.user.email,
      like_count: reply.replyLikes.length,
      is_liked: reply.replyLikes.some((like) => like.userId === userId),
      liked_by: reply.replyLikes.map((like) => mapUserResponse(like.user)),
    })),
  }));
};

export const createComment = async (postId: number, userId: number, content: string) => {
  return prisma.comment.create({
    data: {
      postId,
      userId,
      content,
    },
  });
};

export const createReply = async (commentId: number, userId: number, content: string) => {
  return prisma.reply.create({
    data: {
      commentId,
      userId,
      content,
    },
  });
};

export const findCommentById = async (commentId: number) => {
  return prisma.comment.findUnique({
    where: { id: commentId },
  });
};

export const findCommentByIdAndUser = async (commentId: number, userId: number) => {
  return prisma.comment.findFirst({
    where: { id: commentId, userId },
  });
};

export const updateComment = async (commentId: number, content: string) => {
  return prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });
};

export const deleteComment = async (commentId: number) => {
  await prisma.comment.delete({
    where: { id: commentId },
  });
};

export const findReplyById = async (replyId: number) => {
  return prisma.reply.findUnique({
    where: { id: replyId },
  });
};


