export default class ApiError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
  
    constructor(statusCode: number, message: string, isOperational = true) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = isOperational;
    }
}