export type HashPassword = (password: string) => string;
export type ComparePassword = (password: string, hashedPassword: string) => boolean;
