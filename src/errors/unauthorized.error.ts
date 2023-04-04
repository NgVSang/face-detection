import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api-error.error';

export default class UnauthorizedError extends CustomAPIError {
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
