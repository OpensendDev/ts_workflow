import 'dotenv/config'
import { merge } from 'lodash';
import { AppError } from './common/appError';
import { ERROR_CODE } from './enums/error';

// ENV config will apply on reload
// JSON config must be rebuilt to apply
const defaultConf = require('../configs/default.json');
const env = process.env.NODE_ENV;
const envConf = env ? require(`../configs/${env}.json`) : {};

const configs = merge(defaultConf, envConf);

export const get = (key: string): any => {
  const value = process.env[key] || configs[key];
  if (!value) {
    throw new AppError(ERROR_CODE.UNEXPECTED_ERROR);
  }

  return value;
};
