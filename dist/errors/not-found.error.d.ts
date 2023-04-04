import CustomAPIError from './custom-api-error.error';
export default class NotFoundError extends CustomAPIError {
    constructor(message: string);
}
