import response from "../utils/response";
import httpStatus from "http-status";
import { verifyToken } from "../services/jsonwebtoken.service";
import { SECRET_KEY } from "../config";
const checkEmployee = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(httpStatus.UNAUTHORIZED).json(response({}, "Không có quyền truy cập", 0));
    }
    const token = authorization.split(" ")[1];
    const verify = verifyToken(SECRET_KEY, token);
    if (verify.err) {
        return res
            .status(httpStatus.UNAUTHORIZED)
            .json(response({ type: "EXPIRED" }, "Không có quyền truy cập", 0));
    }
    req.user = verify.user;
    next();
};
const checkAdmin = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(httpStatus.UNAUTHORIZED).json(response({}, "Không có quyền truy cập", 0));
    }
    const token = authorization.split(" ")[1];
    const verify = verifyToken(SECRET_KEY, token);
    if (verify.err || verify.user.role == 1) {
        return res
            .status(httpStatus.UNAUTHORIZED)
            .json(response({ type: "EXPIRED" }, "Không có quyền truy cập", 0));
    }
    req.user = verify.user;
    next();
};
export { checkEmployee, checkAdmin };
//# sourceMappingURL=authorization.middleware.js.map