import { prisma } from '../lib/prisma';

const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
};

const basePostSelect = {
  id: true,
  content: true,
  imageUrl: true,
  visibility: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
};

export const getFeedPosts = async (userId: number) => {
  const posts = await prisma.post.findMany({
    where: {
      OR: [{ visibility: 'public' }, { userId }],
    },
    select: {
      ...basePostSelect,
      user: { select: userSelect },
      _count: {
        select: {
          postLikes: true,
          comments: true,
        },
      },
      postLikes: {
        select: {
          user: { select: userSelect },
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return posts.map((post) => ({
    ...post,
    like_count: post._count.postLikes,
    comment_count: post._count.comments,
    is_liked: post.postLikes.some((like) => like.user.id === userId),
    liked_by: post.postLikes.map((like) => like.user),
  }));
};

export const getPostByIdForUser = async (postId: number, userId: number) => {
  const post = await prisma.post.findFirst({
    where: {
      id: postId,
      OR: [{ visibility: 'public' }, { userId }],
    },
    select: {
      ...basePostSelect,
      user: { select: userSelect },
      _count: {
        select: {
          postLikes: true,
          comments: true,
        },
      },
      postLikes: {
        select: {
          user: { select: userSelect },
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!post) return null;

  return {
    ...post,
    like_count: post._count.postLikes,
    comment_count: post._count.comments,
    is_liked: post.postLikes.some((like) => like.user.id === userId),
    liked_by: post.postLikes.map((like) => like.user),
  };
};

export const getPostLikes = async (postId: number) => {
  const likes = await prisma.postLike.findMany({
    where: { postId },
    select: {
      user: { select: userSelect },
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return likes.map((like) => like.user);
};

export const findPostById = async (postId: number) => {
  return prisma.post.findUnique({
    where: { id: postId },
  });
};

export const findPostByIdAndOwner = async (postId: number, userId: number) => {
  return prisma.post.findFirst({
    where: { id: postId, userId },
  });
};

export const createPost = async (userId: number, content: string | null, imageUrl: string | null, visibility: string) => {
  return prisma.post.create({
    data: {
      userId,
      content,
      imageUrl,
      visibility,
    },
  });
};

export const updatePost = async (postId: number, fields: { content?: string; visibility?: string; image_url?: string | null }) => {
  return prisma.post.update({
    where: { id: postId },
    data: {
      content: fields.content,
      visibility: fields.visibility,
      imageUrl: fields.image_url,
    },
  });
};

export const deletePost = async (postId: number) => {
  await prisma.post.delete({
    where: { id: postId },
  });
};


