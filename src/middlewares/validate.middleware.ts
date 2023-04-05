import httpStatus from "http-status" ;
import ApiError from "../utils/ApiError";
import { Response, NextFunction, Request } from "express";
import  {ObjectSchema} from "joi";

const validator = (schema: ObjectSchema<any>, data: string) => 
  (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = schema.validate(req[data]);
    console.log(value);
    // console.log(error);
    if (error) {
      const message = error.details.map((detail) => detail.message).join(',');
      next(new ApiError(httpStatus.BAD_REQUEST, message));
    } 
    //@ts-ignore
    req.value = value;
    next();
  }

  
export default validator;
