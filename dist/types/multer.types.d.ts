/// <reference types="express-serve-static-core" />
/// <reference types="express-session" />
import multer from 'multer';
export type FileStorageCb = (error: Error | null, destination: string) => void;
export type FileFilterCb = (error: Error | null, destination: boolean) => void;
export type FileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => void;
export interface MulterConfig {
    options: multer.Options;
    fields: multer.Field[];
}
