import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  toggleCommentLikeController,
  togglePostLikeController,
  toggleReplyLikeController,
} from '../controllers/likeController';

const router = express.Router();

router.post('/post/:postId', authenticateToken, togglePostLikeController);
router.post('/comment/:commentId', authenticateToken, toggleCommentLikeController);
router.post('/reply/:replyId', authenticateToken, toggleReplyLikeController);

export default router;

