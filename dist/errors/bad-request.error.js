import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api-error.error';
export default class BadRequestError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}
//# sourceMappingURL=bad-request.error.js.map