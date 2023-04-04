import CustomAPIError from './custom-api-error.error';
export default class BadRequestError extends CustomAPIError {
    constructor(message: string);
}
