import bcrypt from 'bcrypt';
const decodePassword = (code, data) => {
    const hash = bcrypt.compareSync(data, code);
    return hash;
};
export { decodePassword };
//# sourceMappingURL=crypt.service.js.map