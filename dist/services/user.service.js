import * as crypt from './crypt.service';
const checkPassword = (hashPassword, password) => {
    return new Promise((resolve, reject) => {
        const decode = crypt.decodePassword(hashPassword, password);
        if (decode)
            resolve("");
        reject(new Error("Mật khẩu hoặc điện thoại không đúng."));
    });
};
export { checkPassword };
//# sourceMappingURL=user.service.js.map