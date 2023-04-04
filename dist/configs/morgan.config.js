import path from 'path';
import rfs from 'rotating-file-stream';
import { ACCESS_LOG_STREAM_INTERVAL, LOG_FILE, __dirname } from '../config';
export const accessLogStream = rfs.createStream(LOG_FILE, {
    interval: ACCESS_LOG_STREAM_INTERVAL,
    path: path.join(__dirname, '..', 'src', 'logs'),
});
console.log('morgan', path.join(__dirname, '..', 'src', 'logs'));
//# sourceMappingURL=morgan.config.js.map