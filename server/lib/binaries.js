import path from 'path';
import { app } from 'electron';
import platform from 'electron-platform';

const IS_PROD = process.env.NODE_ENV === 'production';
const root = process.cwd();

function getPlatform() {
  if (platform.isWin32) {
    return 'win';
  } else if (platform.isDarwin) {
    return 'mac';
  } else {
    return 'linux';
  }
}

export default () => {
  const { isPackaged, getAppPath } = app;

  return IS_PROD && isPackaged
    ? path.join(path.dirname(getAppPath()), '..', './Resources', './bin')
    : path.join(root, './resources', './bin', getPlatform());
};
