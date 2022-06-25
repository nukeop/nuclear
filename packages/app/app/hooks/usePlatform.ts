import os from 'os';

export enum Platform {
    LINUX = 'linux',
    MAC = 'mac',
    WINDOWS = 'windows',
}

export const usePlatform = () => {
  return {
    linux: Platform.LINUX,
    darwin: Platform.MAC,
    win32: Platform.WINDOWS
  }[os.platform()];
};

export const isLinux = () => usePlatform() === Platform.LINUX;
export const isMac = () => usePlatform() === Platform.MAC;
export const isWindows = () => usePlatform() === Platform.WINDOWS;
