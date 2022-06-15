import validator from 'validator';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { Context } from '../..';

interface SignupArgs {
  credentials: {
    email: string;
    password: string;
  };
  name: string;
  bio: string;
}

interface SigninArgs {
  credentials: {
    email: string;
    password: string;
  };
}

interface UserPayload {
  userErrors: {
    message: string;
  }[];
  token: string | null;
}

export const signup = async (
  _: any,
  { credentials, name, bio }: SignupArgs,
  { prisma }: Context,
): Promise<UserPayload> => {
  const { email, password } = credentials;

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

  await prisma.profile.create({
    data: {
      bio,
      userId: user.id,
    },
  });

  const secret = process.env.JWT_ACCESS_TOKEN!;
  const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '10h' });

  return {
    userErrors: [],
    token,
  };
};

export const signin = async (
  _: any,
  { credentials }: SigninArgs,
  { prisma }: Context,
): Promise<UserPayload> => {
  const { email, password } = credentials;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return {
      userErrors: [{ message: 'Invalid credentials' }],
      token: null,
    };
  }

  const isMatch = await argon2.verify(user.password, password);

  if (!isMatch) {
    return {
      userErrors: [{ message: 'Invalid credentials' }],
      token: null,
    };
  }

  const secret = process.env.JWT_ACCESS_TOKEN!;
  const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '10h' });

  return {
    userErrors: [],
    token,
  };
};
