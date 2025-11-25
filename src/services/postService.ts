import { AppError } from '../errors/AppError';
import {
  createPost,
  deletePost,
  findPostById,
  findPostByIdAndOwner,
  getFeedPosts,
  getPostByIdForUser,
  updatePost,
} from '../repositories/postRepository';
import { findUserById } from '../repositories/userRepository';

const toIsoString = (date: Date | string) => new Date(date).toISOString();

const mapUser = (user?: { id: number; firstName: string; lastName: string; email: string } | null) =>
  user
    ? {
        id: user.id,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
      }
    : null;

const mapPost = (post: any) => ({
  id: post.id,
  user_id: post.userId,
  content: post.content,
  image_url: post.imageUrl,
  visibility: post.visibility,
  created_at: toIsoString(post.createdAt),
  updated_at: toIsoString(post.updatedAt),
  first_name: post.user?.firstName,
  last_name: post.user?.lastName,
  email: post.user?.email,
  like_count: post.like_count ?? post._count?.postLikes ?? 0,
  comment_count: post.comment_count ?? post._count?.comments ?? 0,
  is_liked: post.is_liked ?? false,
  liked_by: (post.liked_by ?? []).map((user: any) => mapUser(user)).filter(Boolean),
});

export const fetchFeed = async (userId: number) => {
  const posts = await getFeedPosts(userId);
  return posts.map((post) => mapPost(post));
};

export const fetchPostById = async (postId: number, userId: number) => {
  const post = await getPostByIdForUser(postId, userId);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  return mapPost(post);
};

export const createNewPost = async (userId: number, content: string | null, visibility: string, imageUrl: string | null) => {
  if (!content && !imageUrl) {
    throw new AppError('Post must have either content or image', 400);
  }

  const post = await createPost(userId, content || null, imageUrl, visibility);
  const user = await findUserById(userId);

  return {
    id: post.id,
    user_id: post.userId,
    content: post.content,
    image_url: post.imageUrl,
    visibility: post.visibility,
    created_at: toIsoString(post.createdAt),
    updated_at: toIsoString(post.updatedAt),
    first_name: user?.firstName,
    last_name: user?.lastName,
    email: user?.email,
    like_count: 0,
    comment_count: 0,
    is_liked: false,
    liked_by: [],
  };
};

export const updateExistingPost = async (
  postId: number,
  userId: number,
  fields: { content?: string; visibility?: string; image_url?: string | null }
) => {
  const existingPost = await findPostByIdAndOwner(postId, userId);
  if (!existingPost) {
    throw new AppError('Post not found', 404);
  }

  await updatePost(postId, fields);
  const updated = await getPostByIdForUser(postId, userId);
  if (!updated) {
    throw new AppError('Post not found', 404);
  }
  return mapPost(updated);
};

export const deleteExistingPost = async (postId: number, userId: number) => {
  const post = await findPostByIdAndOwner(postId, userId);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  await deletePost(postId);
};

export const ensurePostExists = async (postId: number) => {
  const post = await findPostById(postId);
  if (!post) {
    throw new AppError('Post not found', 404);
  }
  return post;
};

