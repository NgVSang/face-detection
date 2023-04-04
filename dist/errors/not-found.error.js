import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api-error.error';
export default class NotFoundError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}
//# sourceMappingURL=not-found.error.js.map