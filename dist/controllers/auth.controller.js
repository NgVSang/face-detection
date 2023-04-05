import response from "../utils/response";
import User from '../models/users.model';
import * as userService from '../services/user.service';
import { createToken } from "../services/jsonwebtoken.service";
import { SECRET_KEY } from "../config";
const login = async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
        });
        await userService.checkPassword(user?.password || "", req.body.password || "");
        const token = createToken({
            secret_key: SECRET_KEY || "asdfad",
            data: {
                id: user?.id || '',
                name: user?.name || '',
                email: user?.email || '',
                gender: user?.gender || '',
                role: user?.role || 1,
            },
            expiresIn: "60days"
        });
        return res.status(200).json(response({ info: user, access_token: token }, "Success", 1));
    }
    catch (error) {
        return res.status(500).json(response({}, error.message || "Lỗi máy chủ", 0));
    }
};
export { login, };
//# sourceMappingURL=auth.controller.js.map