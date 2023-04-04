import winston from 'winston';
import { NODE_ENV } from '../config';
import { ENV } from '../constants';
const options = {
    transports: [
        new winston.transports.Console({
            level: NODE_ENV === ENV.PRODUCT ? 'error' : 'debug',
        }),
        new winston.transports.File({ filename: 'src/logs/debug.log', level: 'debug' }),
    ],
};
const logger = winston.createLogger(options);
if (NODE_ENV !== ENV.PRODUCT) {
    logger.debug('Logging initialized at debug level');
}
export default logger;
//# sourceMappingURL=logger.js.map