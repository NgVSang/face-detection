import multer from 'multer';
import path from 'path';
import { v4 } from 'uuid';

import { MIME_TYPE } from '../constants';
import { FileFilter, FileStorageCb, MulterConfig } from '../types/multer.types';

const fileStorage: multer.StorageEngine = multer.diskStorage({
  destination: (req: Express.Request, file: Express.Multer.File, cb: FileStorageCb) => {
    cb(null, 'src/public/images');
  },
  filename: (req: Express.Request, file: Express.Multer.File, cb: FileStorageCb) => {
    cb(null, v4() + path.extname(file.originalname));
  },
});

const fileFilter: FileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === MIME_TYPE.JPEG || file.mimetype === MIME_TYPE.JPG || file.mimetype === MIME_TYPE.PNG) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const multerConfig: MulterConfig = {
  options: {
    storage: fileStorage,
    fileFilter,
  },
  fields: [
    {
      name: 'image',
      maxCount: 1,
    },
  ],
};

export default multerConfig;
