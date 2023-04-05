import User from "../models/users.model";
import response from "../utils/response";
import bcrypt from 'bcrypt';
import { uploadFileMiddleware } from "../utils/saveImage";
const getListUser = async (req, res) => {
    try {
        const { limit = 10, skip = 0 } = req.query;
        console.log(limit);
        const month = '2023-03';
        const listUser = await User.find({
            role: 1
        })
            .select(['baseSalary', 'name', 'email', 'phoneNumber', 'gender'])
            .limit(limit)
            .skip(skip);
        return res.status(200).json(response({ result: listUser }, "Success", 1));
    }
    catch (error) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
};
const testAddImage = async (req, res) => {
    try {
        await uploadFileMiddleware(req, res);
        const arr = [];
        if (req?.files?.length) {
            arr.push(req?.files);
        }
        return res.status(200).json(response({ resutl: arr }, "Success", 1));
    }
    catch (error) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
};
const createUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({
            ...req.body,
            password: hashedPassword
        });
        return res.status(200).json(response({ user: user }, "Success", 1));
    }
    catch (error) {
        console.log("here");
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
};
const addImageForUser = async (req, res) => {
    try {
        const { limit = 10, skip = 0 } = req.query;
        console.log(limit);
        const month = '2023-03';
        const listUser = await User.find({
            role: 1
        })
            .select(['baseSalary', 'name', 'email', 'phoneNumber', 'gender'])
            .limit(limit)
            .skip(skip);
        return res.status(200).json(response({ result: listUser }, "Success", 1));
    }
    catch (error) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
};
export { getListUser, testAddImage, addImageForUser, createUser };
//# sourceMappingURL=admin.controller.js.map