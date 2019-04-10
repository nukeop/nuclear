import electronDl from 'electron-dl';
import logger from 'electron-timber';
import _ from 'lodash';
import { BrowserWindow, ipcMain } from 'electron';


export const registerDownloadsEvents = () => {
  ipcMain.on('start-download', (event, data) => {
    const streamUrl = _.get(data, 'streams[0].stream');
    electronDl();
    logger.log(`Downloading from ${streamUrl}`);
    const win = BrowserWindow.getFocusedWindow();
 	  electronDl.download(win, streamUrl)
      .then(result => {
        logger.log(result);
      })
      .catch(logger.error);
  });
};
