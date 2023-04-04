import bcrypt from 'bcrypt'

const decodePassword = (code: string, data: string | Buffer) => {
    const hash = bcrypt.compareSync(data, code);
    return hash;
};

export { decodePassword }
