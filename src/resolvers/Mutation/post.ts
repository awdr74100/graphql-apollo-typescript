import { Post, Prisma } from '@prisma/client';
import { Context } from '../..';
import canUserMutatePost from '../../utils/canUserMutatePost';

interface PostArgs {
  post: {
    title?: string;
    content?: string;
  };
}

interface PostPayloadType {
  userErrors: {
    message: string;
  }[];
  post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const postCreate = async (
  _: any,
  { post }: PostArgs,
  { prisma, userInfo }: Context,
): Promise<PostPayloadType> => {
  const { title, content } = post;

  if (!userInfo) {
    return {
      userErrors: [
        {
          message: 'Forbidden access (unauthenticated)',
        },
      ],
      post: null,
    };
  }

  if (!title || !content) {
    return {
      userErrors: [
        {
          message: 'You must provide title and content to create a post',
        },
      ],
      post: null,
    };
  }

  return {
    userErrors: [],
    post: prisma.post.create({
      data: {
        title,
        content,
        authorId: userInfo.userId,
      },
    }),
  };
};

export const postUpdate = async (
  _: any,
  {
    postId,
    post,
  }: {
    postId: string;
    post: PostArgs['post'];
  },
  { prisma, userInfo }: Context,
): Promise<PostPayloadType> => {
  if (!userInfo) {
    return {
      userErrors: [
        {
          message: 'Forbidden access (unauthenticated)',
        },
      ],
      post: null,
    };
  }

  const error = await canUserMutatePost({
    userId: userInfo.userId,
    postId: parseInt(postId, 10),
    prisma,
  });

  if (error) return error;

  const { title, content } = post;

  if (!title && !content) {
    return {
      userErrors: [
        {
          message: 'Need to have at least one field to update',
        },
      ],
      post: null,
    };
  }

  const existingPost = await prisma.post.findUnique({
    where: {
      id: parseInt(postId, 10),
    },
  });

  if (!existingPost) {
    return {
      userErrors: [
        {
          message: 'Post does not exist',
        },
      ],
      post: null,
    };
  }

  const payloadToUpdate = {
    title,
    content,
  };

  if (!title) delete payloadToUpdate.title;
  if (!content) delete payloadToUpdate.content;

  return {
    userErrors: [],
    post: prisma.post.update({
      data: {
        ...payloadToUpdate,
      },
      where: {
        id: parseInt(postId, 10),
      },
    }),
  };
};

export const postDelete = async (
  _: any,
  { postId }: { postId: string },
  { prisma, userInfo }: Context,
): Promise<PostPayloadType> => {
  if (!userInfo) {
    return {
      userErrors: [
        {
          message: 'Forbidden access (unauthenticated)',
        },
      ],
      post: null,
    };
  }

  const error = await canUserMutatePost({
    userId: userInfo.userId,
    postId: parseInt(postId, 10),
    prisma,
  });

  if (error) return error;

  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(postId, 10),
    },
  });

  if (!post) {
    return {
      userErrors: [
        {
          message: 'Post does not exist',
        },
      ],
      post: null,
    };
  }

  await prisma.post.delete({
    where: {
      id: parseInt(postId, 10),
    },
  });

  return {
    userErrors: [],
    post,
  };
};
