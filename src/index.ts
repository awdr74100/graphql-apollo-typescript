import { ApolloServer } from 'apollo-server';
import { PrismaClient, Prisma } from '@prisma/client';
import typeDefs from './schema';
import { Query, Mutation, Profile } from './resolvers';
import getUserFromToken from './utils/getUserFromToken';

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  userInfo: {
    userId: number;
  } | null;
}

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Profile,
  },
  context: ({ req }: any) => {
    const userInfo = getUserFromToken(req.headers.authorization);

    return {
      prisma,
      userInfo,
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`Server is ready at ${url}`);
});
