import { Context } from '..';

interface UserParentType {
  id: number;
}

export const posts = (
  parent: UserParentType,
  __: any,
  { prisma, userInfo }: Context,
) => {
  const isOwnProfile = parent.id === userInfo?.userId;

  return prisma.post.findMany({
    where: {
      authorId: parent.id,
      published: isOwnProfile ? undefined : true,
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  });
};
