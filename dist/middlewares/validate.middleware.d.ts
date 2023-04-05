import { Response, NextFunction, Request } from "express";
import { ObjectSchema } from "joi";
declare const validator: (schema: ObjectSchema<any>, data: string) => (req: Request, res: Response, next: NextFunction) => void;
export default validator;
