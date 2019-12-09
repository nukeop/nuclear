import { app } from 'electron';
import platform from 'electron-platform';
import path from 'path';

export const Platform = {
  LINUX: 'linux',
  WINDOWS: 'win',
  MAC: 'mac'
};

/**
 * @see {@link https://github.com/electron-utils/electron-platform}
 */

/**
 * return a string representing the platform
 * @returns {string}
 */
export function getPlatform() {
  if (platform.isWin32) {
    return Platform.WINDOWS;
  } else if (platform.isDarwin) {
    return Platform.MAC;
  } else {
    return Platform.LINUX;
  }
}

/**
 * @returns {boolean}
 */
export function isLinux() {
  return getPlatform() === Platform.LINUX;
}

/**
 * @returns {boolean}
 */
export function isMac() {
  return platform.isDarwin;
}

/**
 * @returns {boolean}
 */
export function isWin32() {
  return platform.isWin32;
}

/**
 * get the path of external binaries
 * @returns {string}
 */
export function getBinaryPath() {
  const { isPackaged, getAppPath } = app;

  return process.env.NODE_ENV === 'production' && isPackaged
    ? path.join(path.dirname(getAppPath()), '..', './resources', './bin')
    : path.join(process.cwd(), './bin', getPlatform());
}
