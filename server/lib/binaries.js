import path from 'path';
import { app } from 'electron';
import getPlatform from './platform';

const IS_PROD = process.env.NODE_ENV === 'production';
const root = process.cwd();

export default () => {
  const { isPackaged, getAppPath } = app;

  return IS_PROD && isPackaged
    ? path.join(path.dirname(getAppPath()), '..', './Resources', './bin')
    : path.join(root, './resources', './bin', getPlatform());
};
