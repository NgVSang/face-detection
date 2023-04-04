import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api-error.error';
export default class UnauthorizedError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}
//# sourceMappingURL=unauthorized.error.js.map