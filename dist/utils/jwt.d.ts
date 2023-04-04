/// <reference types="qs" />
/// <reference types="express" />
/// <reference types="node" />
import jwt from 'jsonwebtoken';
export declare const generateToken: (payload: Record<string, unknown>, expires?: string) => string;
export declare const verifyToken: (token: string) => string | jwt.JwtPayload;
export declare const requiredSignIn: {
    (req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: import("express").Response<any, Record<string, any>>, next: import("express").NextFunction): Promise<void | NodeJS.Immediate>;
    unless: typeof import("express-unless").unless;
};
