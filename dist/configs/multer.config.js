import multer from 'multer';
import path from 'path';
import { v4 } from 'uuid';
import { MIME_TYPE } from '../constants';
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/images');
    },
    filename: (req, file, cb) => {
        cb(null, v4() + path.extname(file.originalname));
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === MIME_TYPE.JPEG || file.mimetype === MIME_TYPE.JPG || file.mimetype === MIME_TYPE.PNG) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const multerConfig = {
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
//# sourceMappingURL=multer.config.js.map