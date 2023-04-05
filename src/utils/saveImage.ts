import multer from 'multer';
import path from 'path';
import {__dirname} from '../config';
import { v4 as uuidv4 } from 'uuid'
import util from 'util'

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/public/userImages")
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + "." + file.mimetype.split("/")[1]);
  }
});

// Initialize upload
const uploadFile = multer({
  storage: storage,
  limits: { fileSize: 1000000000 },
  fileFilter: (req, file, cb) => {
    if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error("Chỉ nhận định dạng .jpg , .jpeg hoặc .png"));
    }
},
}).array('photos', 30); // 'photos' là tên của field chứa ảnh trong form, 10 là số lượng ảnh tối đa được phép tải lên

const uploadFileMiddleware = util.promisify(uploadFile);

export {
  uploadFileMiddleware
}
