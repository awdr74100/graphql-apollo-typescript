import { Context } from '..';

export const me = (_: any, __: any, { prisma, userInfo }: Context) => {
  if (!userInfo) return null;

  return prisma.user.findUnique({
    where: {
      id: userInfo.userId,
    },
  });
};

export const profile = (
  _: any,
  { userId }: { userId: string },
  { prisma }: Context,
) => {
  return prisma.profile.findUnique({
    where: {
      userId: parseInt(userId, 10),
    },
  });
};

export const posts = (_: any, __: any, { prisma }: Context) => {
  return prisma.post.findMany({
    where: {
      published: true,
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  });
};
