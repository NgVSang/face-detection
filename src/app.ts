import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';
import errorHandler from 'errorhandler';
import { CLIENT_URL, PORT, __dirname } from './config';
import { accessLogStream } from './configs';
import { ENVIRONMENT } from './utils/secrets';
import { ENV } from './constants';
import { detectFace, init } from './utils/face-recognition';
import {connectDatabase} from './configs/db.config';
import {errorConverter, handleError, handleNotFound} from './middlewares/error.middleware';
import apiRoutes from './routes/index.routes'
import {monkeyPatchFaceApiEnv} from './utils/monkeyPatch';
import path from 'path';

const app = express();
app.use(cors());
monkeyPatchFaceApiEnv();
// init();
connectDatabase()

app.set('port', PORT || 9000);

app.use(helmet());
app.use(
  compression({
    level: 6,
    threshold: 100 * 1000, // just compress when data is over 100kB
    filter: (req: Request, res: Response) => {
      if (req.headers['x-no-compress']) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);

// app.use(express.json());
app.use(express.static(path.join(__dirname + "/public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: accessLogStream }));


const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/detect', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  let labels: string[] = [];

  if (req.file?.buffer) {
    labels = await detectFace(req.file?.buffer);
  }

  res.json(labels);
});

//routes
app.use("/api", apiRoutes);

app.use(errorConverter);
app.use(handleError);
app.use(handleNotFound);

if (ENVIRONMENT === ENV.DEV) {
  app.use(errorHandler());
}

export default app;
