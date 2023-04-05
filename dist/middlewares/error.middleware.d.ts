import { Response, NextFunction, Request } from "express";
declare const handleNotFound: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
declare const errorConverter: (err: any, req: Request, res: Response, next: NextFunction) => void;
declare const handleError: (err: any, req: any, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export { handleError, errorConverter, handleNotFound };
