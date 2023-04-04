import { expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';
import { JWT_LIFETIME, JWT_SECRET } from '../config';

export const generateToken = (payload: Record<string, unknown>, expires?: string) => {
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: expires || JWT_LIFETIME,
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET as string);
};

export const requiredSignIn = expressjwt({
  secret: JWT_SECRET as string,
  algorithms: ['HS256'],
});
