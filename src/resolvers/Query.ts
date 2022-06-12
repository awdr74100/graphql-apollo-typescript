import { Context } from '..';

export const posts = (_: any, __: any, { prisma }: Context) => {
  return prisma.post.findMany({
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  });
};
