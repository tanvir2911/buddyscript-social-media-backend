import { AppError } from '../errors/AppError';
import {
  addCommentLike,
  addPostLike,
  addReplyLike,
  findCommentLike,
  findPostLike,
  findReplyLike,
  removeCommentLike,
  removePostLike,
  removeReplyLike,
} from '../repositories/likeRepository';
import { ensurePostExists } from './postService';
import { findCommentById, findReplyById } from '../repositories/commentRepository';

export const togglePostLike = async (postId: number, userId: number) => {
  await ensurePostExists(postId);
  const existingLike = await findPostLike(postId, userId);

  if (existingLike) {
    await removePostLike(postId, userId);
    return { message: 'Post unliked', liked: false };
  }

  await addPostLike(postId, userId);
  return { message: 'Post liked', liked: true };
};

export const toggleCommentLike = async (commentId: number, userId: number) => {
  const comment = await findCommentById(commentId);
  if (!comment) {
    throw new AppError('Comment not found', 404);
  }

  const existingLike = await findCommentLike(commentId, userId);

  if (existingLike) {
    await removeCommentLike(commentId, userId);
    return { message: 'Comment unliked', liked: false };
  }

  await addCommentLike(commentId, userId);
  return { message: 'Comment liked', liked: true };
};

export const toggleReplyLike = async (replyId: number, userId: number) => {
  const reply = await findReplyById(replyId);
  if (!reply) {
    throw new AppError('Reply not found', 404);
  }

  const existingLike = await findReplyLike(replyId, userId);
  if (existingLike) {
    await removeReplyLike(replyId, userId);
    return { message: 'Reply unliked', liked: false };
  }

  await addReplyLike(replyId, userId);
  return { message: 'Reply liked', liked: true };
};


