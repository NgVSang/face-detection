import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api-error.error';
export default class UnauthenticatedError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}
//# sourceMappingURL=unauthenticated.error.js.map