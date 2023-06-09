import response from "../utils/response"
import { NextFunction, Response , Request} from "express";
import httpStatus from "http-status";
import {verifyToken} from "../services/jsonwebtoken.service";
import {SECRET_KEY} from "../config";

const checkEmployee = (req: any, res: Response, next: NextFunction) => {
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

const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(httpStatus.UNAUTHORIZED).json(response({}, "Không có quyền truy cập", 0));
    }
    const token = authorization.split(" ")[1];
    const verify = verifyToken(SECRET_KEY, token);
    //@ts-ignore
    if (verify.err || verify.user.role == 1 ) {
        return res
            .status(httpStatus.UNAUTHORIZED)
            .json(response({ type: "EXPIRED" }, "Không có quyền truy cập", 0));
    }
    //@ts-ignore
    req.user = verify.user;
    next();
};


export {
    checkEmployee,
    checkAdmin
}