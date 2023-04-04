import { Response, NextFunction, Request } from "express";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";

const handleNotFound = (req: Request, res: Response, next: NextFunction) => {
    return res.status(httpStatus.NOT_FOUND).json({ status: 0, message: "Not Found", data: {} });
};

const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new ApiError(statusCode, message);
    }
    return next(error);
};

const handleError = (err: any, req: any, res: Response, next: NextFunction) => {
    let { statusCode, message } = err;
    if (process.env.NODE_ENV !== "production" && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }
    const response = {
        code: statusCode,
        message,
        status: 0,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    };
    if (process.env.NODE_ENV === "development") {
    }
    return res.status(statusCode).json(response);
};

export {
    handleError,
    errorConverter,
    handleNotFound
}