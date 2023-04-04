import { StatusCodes } from 'http-status-codes';
export default class CustomAPIError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
}
//# sourceMappingURL=custom-api-error.error.js.map