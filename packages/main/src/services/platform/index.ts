import { app } from 'electron';
import path from 'path';
import { injectable } from 'inversify';

export enum PlatformNames {
  LINUX= 'linux',
  WINDOWS= 'win',
  MAC= 'mac'
}

/**
 * @see {@link https://github.com/electron-utils/electron-platform}
 */
@injectable()
class Platform {
  getPlatform(): string {
    if (process.platform === 'win32') {
      return PlatformNames.WINDOWS;
    } else if (process.platform === 'darwin') {
      return PlatformNames.MAC;
    } else {
      return PlatformNames.LINUX;
    }
  }
  
  isLinux(): boolean {
    return this.getPlatform() === PlatformNames.LINUX;
  }
  
  isMac(): boolean {
    return process.platform === 'darwin';
  }
  
  isWindows(): boolean {
    return process.platform === 'win32';
  }
  
  getBinaryPath(): string {
    const { isPackaged, getAppPath } = app;
  
    return process.env.NODE_ENV === 'production' && isPackaged
      ? path.join(path.dirname(getAppPath()), '..', './resources', './bin')
      : path.join(__dirname, '../bin', this.getPlatform());
  }
  
}

export default Platform;
