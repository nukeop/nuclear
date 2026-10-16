import { invoke } from '@tauri-apps/api/core';

export const isFlatpak = async (): Promise<boolean> => {
  return invoke<boolean>('is_flatpak');
};

export const copyDirRecursive = async (
  from: string,
  to: string,
): Promise<void> => {
  await invoke('copy_dir_recursive', { from, to });
};

export const extractZip = async (
  zipPath: string,
  destPath: string,
): Promise<void> => {
  await invoke('extract_zip', { zipPath, destPath });
};

export const downloadFile = async (
  url: string,
  destPath: string,
): Promise<void> => {
  await invoke('download_file', { url, destPath });
};
