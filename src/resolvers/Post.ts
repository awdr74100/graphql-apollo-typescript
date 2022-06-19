import { Context } from '..';
import userLoader from '../loaders/userLoader';

interface PostParentType {
  authorId: number;
}

export const user = (
  { authorId }: PostParentType,
  __: any,
  { prisma }: Context,
) => {
  return userLoader.load(authorId);
};
