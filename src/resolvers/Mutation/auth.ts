import { Context } from '../..';

interface SignupArgs {
  email: string;
  name: string;
  password: string;
  bio: string;
}

export const signup = (
  _: any,
  { email, name, password, bio }: SignupArgs,
  { prisma }: Context,
) => {
  return prisma.user.create({
    data: {
      email,
      name,
      password,
    },
  });
};
