import { StatusCodes } from 'http-status-codes';
export default class CustomAPIError extends Error {
    statusCode: StatusCodes;
    data: any;
    constructor(message: string);
}
