import express from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import {
  createCommentController,
  createReplyController,
  deleteCommentController,
  getComments,
  updateCommentController,
} from '../controllers/commentController';

const router = express.Router();

router.get('/post/:postId', authenticateToken, getComments);

router.post(
  '/',
  authenticateToken,
  [body('post_id').isInt().withMessage('Valid post ID is required'), body('content').trim().notEmpty().withMessage('Content is required')],
  validateRequest,
  createCommentController
);

router.post(
  '/reply',
  authenticateToken,
  [body('comment_id').isInt().withMessage('Valid comment ID is required'), body('content').trim().notEmpty().withMessage('Content is required')],
  validateRequest,
  createReplyController
);

router.put('/:id', authenticateToken, [body('content').trim().notEmpty().withMessage('Content is required')], validateRequest, updateCommentController);

router.delete('/:id', authenticateToken, deleteCommentController);

export default router;

