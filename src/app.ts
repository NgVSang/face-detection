import bodyParser from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import faceapi from 'face-api.js';
import morgan from 'morgan';
import multer from 'multer';
import errorHandler from 'errorhandler';
import { CLIENT_URL, PORT, __dirname } from './config';
import { accessLogStream } from './configs';
import { ENVIRONMENT } from './utils/secrets';
import { ENV } from './constants';
import {connectDatabase} from './configs/db.config';
import {errorConverter, handleError, handleNotFound} from './middlewares/error.middleware';
import apiRoutes from './routes/index.routes'
import {monkeyPatchFaceApiEnv} from './utils/monkeyPatch';
import path from 'path';

const MODAL_PATH = path.join(__dirname, 'lib');

Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromDisk(MODAL_PATH),
  faceapi.nets.faceLandmark68Net.loadFromDisk(MODAL_PATH),
  faceapi.nets.faceRecognitionNet.loadFromDisk(MODAL_PATH),
]);

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

//routes
app.use("/api", apiRoutes);

app.use(errorConverter);
app.use(handleError);
app.use(handleNotFound);

if (ENVIRONMENT === ENV.DEV) {
  app.use(errorHandler());
}

export default app;
