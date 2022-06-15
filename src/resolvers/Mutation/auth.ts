import validator from 'validator';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
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
  token: string | null;
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
      token: null,
    };
  }

  const isValidPassword = validator.isLength(password, { min: 5 });

  if (!isValidPassword) {
    return {
      userErrors: [{ message: 'Invalid password' }],
      token: null,
    };
  }

  if (!name || !bio) {
    return {
      userErrors: [{ message: 'Invalid name or bio' }],
      token: null,
    };
  }

  const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    `${process.env.JWT_ACCESS_TOKEN}`,
    { expiresIn: '10h' },
  );

  return {
    userErrors: [],
    token,
  };
};
