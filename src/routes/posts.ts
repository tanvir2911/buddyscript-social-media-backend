import express from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../utils/upload';
import { validateRequest } from '../middleware/validateRequest';
import {
  createPostController,
  deletePostController,
  getPostByIdController,
  getPosts,
  updatePostController,
} from '../controllers/postController';

const router = express.Router();

router.get('/', authenticateToken, getPosts);
router.get('/:id', authenticateToken, getPostByIdController);

const postValidations = [
  body('content').optional().trim(),
  body('visibility').optional().isIn(['public', 'private']).withMessage('Visibility must be public or private'),
];

router.post('/', authenticateToken, upload.single('image'), postValidations, validateRequest, createPostController);

router.put('/:id', authenticateToken, upload.single('image'), postValidations, validateRequest, updatePostController);

router.delete('/:id', authenticateToken, deletePostController);

export default router;

