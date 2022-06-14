import validator from 'validator';
import { Context } from '../..';

interface SignupArgs {
  email: string;
  name: string;
  password: string;
  bio: string;
}

interface UserPayload {
  userErrors: {
    message: string;
  }[];
  user: null;
}

export const signup = async (
  _: any,
  { email, name, password, bio }: SignupArgs,
  { prisma }: Context,
): Promise<UserPayload> => {
  const isEmail = validator.isEmail(email);

  if (!isEmail) {
    return {
      userErrors: [{ message: 'Invalid email' }],
      user: null,
    };
  }

  const isValidPassword = validator.isLength(password, { min: 5 });

  if (!isValidPassword) {
    return {
      userErrors: [{ message: 'Invalid password' }],
      user: null,
    };
  }

  if (!name || !bio) {
    return {
      userErrors: [{ message: 'Invalid name or bio' }],
      user: null,
    };
  }

  return {
    userErrors: [],
    user: null,
  };

  // return prisma.user.create({
  //   data: {
  //     email,
  //     name,
  //     password,
  //   },
  // });
};
