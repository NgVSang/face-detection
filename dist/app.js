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
import { connectDatabase } from './configs/db.config';
import { errorConverter, handleError, handleNotFound } from './middlewares/error.middleware';
import apiRoutes from './routes/index.routes';
const app = express();
connectDatabase();
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: accessLogStream }));

app.use("/api", apiRoutes);
app.use(errorConverter);
app.use(handleError);
app.use(handleNotFound);
if (ENVIRONMENT === ENV.DEV) {
    app.use(cors({ origin: CLIENT_URL }));
    app.use(errorHandler());
}
export default app;
//# sourceMappingURL=app.js.map