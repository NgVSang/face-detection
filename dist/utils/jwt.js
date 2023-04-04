import { expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';
import { JWT_LIFETIME, JWT_SECRET } from '../config';
export const generateToken = (payload, expires) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: expires || JWT_LIFETIME,
    });
};
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
export const requiredSignIn = expressjwt({
    secret: JWT_SECRET,
    algorithms: ['HS256'],
});
//# sourceMappingURL=jwt.js.map