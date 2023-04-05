import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
const validator = (schema, data) => (req, res, next) => {
    const { value, error } = schema.validate(req[data]);
    console.log(value);
    if (error) {
        const message = error.details.map((detail) => detail.message).join(',');
        next(new ApiError(httpStatus.BAD_REQUEST, message));
    }
    req.value = value;
    next();
};
export default validator;
//# sourceMappingURL=validate.middleware.js.map