import CustomAPIError from './custom-api-error.error';
export default class UnauthorizedError extends CustomAPIError {
    constructor(message: string);
}
