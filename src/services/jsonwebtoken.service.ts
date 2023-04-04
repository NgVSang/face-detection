import jwt from 'jsonwebtoken'

interface createProps {
    secret_key: jwt.Secret
    data:  object 
    expiresIn?:string | number
}

const createToken = ({secret_key, data, expiresIn}:createProps) => {
    return jwt.sign(data, secret_key, {
        algorithm: "HS256",
        expiresIn: expiresIn,
    });
};

const verifyToken = (secret_key: jwt.Secret, token: string) => {
    try {
        const decode = jwt.verify(token, secret_key);
        return {
            error: null,
            user: decode,
        };
    } catch (error) {
        return { err: error };
    }
};

export { createToken, verifyToken };
