import jwt from 'jsonwebtoken';
const createToken = ({ secret_key, data, expiresIn }) => {
    return jwt.sign(data, secret_key, {
        algorithm: "HS256",
        expiresIn: expiresIn,
    });
};
const verifyToken = (secret_key, token) => {
    try {
        const decode = jwt.verify(token, secret_key);
        return {
            error: null,
            user: decode,
        };
    }
    catch (error) {
        return { err: error };
    }
};
export { createToken, verifyToken };
//# sourceMappingURL=jsonwebtoken.service.js.map