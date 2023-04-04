import bluebird from 'bluebird';
import chalk from 'chalk';
import mongoose from 'mongoose';

import { MONGO_URL } from '../config';

mongoose.Promise = bluebird;

export const connectDatabase = () => {
  console.log(chalk.blueBright('Connecting to MongoDB'));

  mongoose
    .connect(MONGO_URL as string)
    .then(() => {
      console.log(chalk.green('Successfully connect to MongoDB!'));
    })
    .catch((err: Error) => {
      console.error(`Could not connect to the database. Exiting now...\n${err}`);
      process.exit();
    });
};
