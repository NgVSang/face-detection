import CustomAPIError from './custom-api-error.error';
export default class UnauthenticatedError extends CustomAPIError {
    constructor(message: string);
}
