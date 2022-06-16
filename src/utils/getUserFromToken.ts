import jwt from 'jsonwebtoken';

export default (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_TOKEN!) as {
      userId: number;
    };
  } catch (err: any) {
    return null;
  }
};
