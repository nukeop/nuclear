import electronDl from 'electron-dl';
import logger from 'electron-timber';
import { ipcMain } from 'electron';

export const registerDownloadsEvents = () => {
  ipcMain.on('start-download', (event, data) => {
    console.log(data);
    logger.log(event);
    logger.log(JSON.stringify(data));
  });
};
