import { Context } from '..';

interface PostParentType {
  authorId: number;
}

export const user = (
  { authorId }: PostParentType,
  __: any,
  { prisma }: Context,
) => {
  return prisma.user.findUnique({
    where: {
      id: authorId,
    },
  });
};
