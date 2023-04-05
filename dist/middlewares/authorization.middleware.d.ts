import { NextFunction, Response, Request } from "express";
declare const checkEmployee: (req: any, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
declare const checkAdmin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export { checkEmployee, checkAdmin };
