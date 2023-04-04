import bcrypt from 'bcryptjs';
import { ComparePassword, HashPassword } from '../types/bcrypt.types';

export const hashPassword: HashPassword = (password: string) => {
  return bcrypt.hashSync(password, 12);
};

export const comparePassword: ComparePassword = (password: string, hashedPassword: string) => {
  return bcrypt.compareSync(password, hashedPassword);
};
