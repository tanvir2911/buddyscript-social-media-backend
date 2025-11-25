import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { togglePostLike, toggleCommentLike, toggleReplyLike } from '../services/likeService';

export const togglePostLikeController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const postId = parseInt(req.params.postId, 10);
    const result = await togglePostLike(postId, userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const toggleCommentLikeController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const commentId = parseInt(req.params.commentId, 10);
    const result = await toggleCommentLike(commentId, userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const toggleReplyLikeController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const replyId = parseInt(req.params.replyId, 10);
    const result = await toggleReplyLike(replyId, userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};


