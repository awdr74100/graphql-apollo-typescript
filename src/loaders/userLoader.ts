import DataLoader from 'dataloader';
import { User } from '@prisma/client';
import { prisma } from '..';

type BatchFunction = (ids: readonly number[]) => Promise<User[]>;

const batchFunction: BatchFunction = async (ids) => {
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: [...ids],
      },
    },
  });

  const usersMap: { [key: string]: User } = {};

  users.forEach((user) => {
    usersMap[user.id] = user;
  });

  return ids.map((id) => usersMap[id]);
};

export default new DataLoader<number, User>(batchFunction);
