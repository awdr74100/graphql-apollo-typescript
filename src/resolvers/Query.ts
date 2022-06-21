import { Context } from '..';

export const me = (_: any, __: any, { prisma, userInfo }: Context) => {
  if (!userInfo) return null;

  return prisma.user.findUnique({
    where: {
      id: userInfo.userId,
    },
  });
};

export const profile = async (
  _: any,
  { userId }: { userId: string },
  { prisma, userInfo }: Context,
) => {
  const isMyProfile = parseInt(userId) === userInfo?.userId;

  const profile = await prisma.profile.findUnique({
    where: {
      userId: parseInt(userId, 10),
    },
  });

  if (!profile) return null;

  return {
    ...profile,
    isMyProfile,
  };
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
