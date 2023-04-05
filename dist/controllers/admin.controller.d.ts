import { Response, Request } from "express";
declare const getListUser: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const testAddImage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const createUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const addImageForUser: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
export { getListUser, testAddImage, addImageForUser, createUser };
