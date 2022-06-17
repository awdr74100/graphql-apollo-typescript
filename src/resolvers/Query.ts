import { Context } from '..';

export const me = (_: any, __: any, { prisma, userInfo }: Context) => {
  if (!userInfo) return null;

  return prisma.user.findUnique({
    where: {
      id: userInfo.userId,
    },
  });
};

export const posts = (_: any, __: any, { prisma }: Context) => {
  return prisma.post.findMany({
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  });
};
