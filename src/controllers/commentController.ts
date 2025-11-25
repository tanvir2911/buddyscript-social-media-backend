import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  addComment,
  addReply,
  deleteUserComment,
  getCommentsForPost,
  updateUserComment,
} from '../services/commentService';

export const getComments = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const postId = parseInt(req.params.postId, 10);
    const comments = await getCommentsForPost(postId, userId);
    res.json({ comments });
  } catch (error) {
    next(error);
  }
};

export const createCommentController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { post_id, content } = req.body;
    const postId = typeof post_id === 'number' ? post_id : parseInt(post_id, 10);
    const comment = await addComment(postId, userId, content);
    res.status(201).json({
      message: 'Comment created successfully',
      comment: {
        ...comment,
        like_count: 0,
        is_liked: false,
        liked_by: [],
        replies: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createReplyController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { comment_id, content } = req.body;
    const commentId = typeof comment_id === 'number' ? comment_id : parseInt(comment_id, 10);
    const reply = await addReply(commentId, userId, content);
    res.status(201).json({
      message: 'Reply created successfully',
      reply: {
        ...reply,
        like_count: 0,
        is_liked: false,
        liked_by: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCommentController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const commentId = parseInt(req.params.id, 10);
    const { content } = req.body;
    const comment = await updateUserComment(commentId, userId, content);
    res.json({
      message: 'Comment updated successfully',
      comment,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCommentController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const commentId = parseInt(req.params.id, 10);
    await deleteUserComment(commentId, userId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};


