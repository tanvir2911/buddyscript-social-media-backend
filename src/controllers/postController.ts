import { Request, Response, NextFunction } from 'express';
import { fetchFeed, fetchPostById, createNewPost, updateExistingPost, deleteExistingPost } from '../services/postService';
import { AuthRequest } from '../middleware/auth';
import { uploadToCloudinary } from '../utils/upload';
import { AppError } from '../errors/AppError';

export const getPosts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const posts = await fetchFeed(userId);
    res.json({ posts });
  } catch (error) {
    next(error);
  }
};

export const getPostByIdController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const postId = parseInt(req.params.id, 10);
    const post = await fetchPostById(postId, userId);
    res.json({ post });
  } catch (error) {
    next(error);
  }
};

export const createPostController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const { content, visibility = 'public' } = req.body;

    let imageUrl: string | null = null;
    if (req.file) {
      try {
        imageUrl = await uploadToCloudinary(req.file.buffer);
      } catch (uploadError) {
        return next(new AppError('Failed to upload image', 500));
      }
    }

    const post = await createNewPost(userId, content || null, visibility, imageUrl);

    res.status(201).json({
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePostController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const postId = parseInt(req.params.id, 10);
    const { content, visibility } = req.body;
    const fields: { content?: string; visibility?: string; image_url?: string | null } = {};

    if (content !== undefined) fields.content = content;
    if (visibility !== undefined) fields.visibility = visibility;

    if (req.file) {
      try {
        fields.image_url = await uploadToCloudinary(req.file.buffer);
      } catch (uploadError) {
        return next(new AppError('Failed to upload image', 500));
      }
    }

    const post = await updateExistingPost(postId, userId, fields);
    res.json({
      message: 'Post updated successfully',
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePostController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const postId = parseInt(req.params.id, 10);
    await deleteExistingPost(postId, userId);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};


