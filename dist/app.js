import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';
import errorHandler from 'errorhandler';
import { CLIENT_URL, PORT } from './config';
import { accessLogStream } from './configs';
import { ENVIRONMENT } from './utils/secrets';
import { ENV } from './constants';
import { detectFace, init } from './utils/face-recognition';
const app = express();
init();
app.set('port', PORT || 9000);
app.use(helmet());
app.use(compression({
    level: 6,
    threshold: 100 * 1000,
    filter: (req, res) => {
        if (req.headers['x-no-compress']) {
            return false;
        }
        return compression.filter(req, res);
    },
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: accessLogStream }));
const storage = multer.memoryStorage();
const upload = multer({ storage });
app.post('/detect', upload.single('file'), async (req, res, next) => {
    let labels = [];
    if (req.file?.buffer) {
        labels = await detectFace(req.file?.buffer);
    }
    res.json(labels);
});
if (ENVIRONMENT === ENV.DEV) {
    app.use(cors({ origin: CLIENT_URL }));
    app.use(errorHandler());
}
export default app;
//# sourceMappingURL=app.js.map