import { Context } from '..';

interface ProfileParentType {
  id: number;
  bio: string;
  userId: number;
}

export const user = (
  { userId }: ProfileParentType,
  __: any,
  { prisma }: Context,
) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};
