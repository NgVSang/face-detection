import * as crypt from './crypt.service'

const checkPassword = (hashPassword: string, password: string) => {
    return new Promise((resolve, reject) => {
        const decode = crypt.decodePassword(hashPassword, password);
        if (decode) resolve("");
        reject(new Error("Mật khẩu hoặc điện thoại không đúng."));
    });
};

export {
    checkPassword
}