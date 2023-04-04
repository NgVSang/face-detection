import httpStatus from "http-status" ;
import ApiError from "../utils/ApiError";
import { Response, NextFunction } from "express";
import  {ObjectSchema} from "joi";

const validator = (schema: ObjectSchema<any>, data: string) => 
  (req: any, res: Response, next: NextFunction) => {
    const { value, error } = schema.validate(req[data]);
    // console.log(error);
    if (error) {
      const message = error.details.map((detail) => detail.message).join(',');
      next(new ApiError(httpStatus.BAD_REQUEST, message));
    } 
    req.value = value;
    next();
  }

  
export default validator;
