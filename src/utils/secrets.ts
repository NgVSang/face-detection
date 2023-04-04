import fs from 'fs';
import dotenv from 'dotenv';
import logger from './logger';
import { MONGO_URL, NODE_ENV, SESSION_SECRET } from '../config';

if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
} else {
  logger.debug('Using .env.example file to supply config environment variables');
  dotenv.config({ path: '.env.example' });
}

export const ENVIRONMENT = NODE_ENV;

if (!SESSION_SECRET) {
  logger.error('No client secret. Set SESSION_SECRET environment variable.');
  process.exit(1);
}

// if (!MONGO_URL) {
//   logger.error('No mongo connection string. Set MONGODB_URL environment variable.');
//   process.exit(1);
// }
