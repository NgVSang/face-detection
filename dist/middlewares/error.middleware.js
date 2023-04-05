import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
const handleNotFound = (req, res, next) => {
    return res.status(httpStatus.NOT_FOUND).json({ status: 0, message: "Not Found", data: {} });
};
const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new ApiError(statusCode, message);
    }
    return next(error);
};
const handleError = (err, req, res, next) => {
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
export { handleError, errorConverter, handleNotFound };
//# sourceMappingURL=error.middleware.js.map