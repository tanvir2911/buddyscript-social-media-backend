import { AppError } from '../errors/AppError';
import {
  createComment,
  createReply,
  deleteComment,
  findCommentById,
  findCommentByIdAndUser,
  getCommentsWithStats,
  updateComment,
} from '../repositories/commentRepository';
import { ensurePostExists } from './postService';
import { findUserById } from '../repositories/userRepository';

export const getCommentsForPost = async (postId: number, userId: number) => {
  await ensurePostExists(postId);
  return getCommentsWithStats(postId, userId);
};

export const addComment = async (postId: number, userId: number, content: string) => {
  await ensurePostExists(postId);
  const comment = await createComment(postId, userId, content);
  const user = await findUserById(userId);
  return {
    id: comment.id,
    post_id: comment.postId,
    user_id: comment.userId,
    content: comment.content,
    created_at: comment.createdAt.toISOString(),
    updated_at: comment.updatedAt.toISOString(),
    first_name: user?.firstName,
    last_name: user?.lastName,
    email: user?.email,
  };
};

export const addReply = async (commentId: number, userId: number, content: string) => {
  const comment = await findCommentById(commentId);
  if (!comment) {
    throw new AppError('Comment not found', 404);
  }
  const reply = await createReply(commentId, userId, content);
  const user = await findUserById(userId);
  return {
    id: reply.id,
    comment_id: reply.commentId,
    user_id: reply.userId,
    content: reply.content,
    created_at: reply.createdAt.toISOString(),
    updated_at: reply.updatedAt.toISOString(),
    first_name: user?.firstName,
    last_name: user?.lastName,
    email: user?.email,
  };
};

export const updateUserComment = async (commentId: number, userId: number, content: string) => {
  const comment = await findCommentByIdAndUser(commentId, userId);
  if (!comment) {
    throw new AppError('Comment not found', 404);
  }
  const updatedComment = await updateComment(commentId, content);
  return {
    id: updatedComment.id,
    post_id: updatedComment.postId,
    user_id: updatedComment.userId,
    content: updatedComment.content,
    created_at: updatedComment.createdAt.toISOString(),
    updated_at: updatedComment.updatedAt.toISOString(),
  };
};

export const deleteUserComment = async (commentId: number, userId: number) => {
  const comment = await findCommentByIdAndUser(commentId, userId);
  if (!comment) {
    throw new AppError('Comment not found', 404);
  }
  await deleteComment(commentId);
};


