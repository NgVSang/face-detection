import jwt from 'jsonwebtoken';
interface createProps {
    secret_key: jwt.Secret;
    data: object;
    expiresIn?: string | number;
}
declare const createToken: ({ secret_key, data, expiresIn }: createProps) => string;
declare const verifyToken: (secret_key: jwt.Secret, token: string) => {
    error: null;
    user: string | jwt.JwtPayload;
    err?: undefined;
} | {
    err: unknown;
    error?: undefined;
    user?: undefined;
};
export { createToken, verifyToken };
