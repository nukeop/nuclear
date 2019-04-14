import 'isomorphic-fetch';
import electronDl, { download } from 'electron-dl';
import logger from 'electron-timber';
import ytdl from 'ytdl-core';
import _ from 'lodash';
import { ipcMain } from 'electron';

import { trackSearch } from '../app/rest/youtube-search';

let rendererWindow = null;
electronDl();

export const registerDownloadsEvents = window => {
  ipcMain.once('started', event => {
    rendererWindow = event.sender;
  });
  
  ipcMain.on('start-download', (event, data) => {
    const query = `${_.get(data, 'artist.name')} ${_.get(data, 'name')}`;
    const filename = `${_.get(data, 'artist.name')} - ${_.get(data, 'name')}`;

    // In order to get a valid stream URL, we need to generate it right before downloading
    trackSearch(query)
      .then(results => results.json())
      .then(data => {
        const trackId = _.get(_.head(data.items), 'id.videoId');
        return ytdl.getInfo(`http://www.youtube.com/watch?v=${trackId}`);
      })
      .then(videoInfo => {
        const formatInfo = _.head(videoInfo.formats.filter(e => e.itag === '140'));
        const streamUrl = formatInfo.url;
        
        return download(window, streamUrl, {
          filename: filename,
          onStarted: () => {
            rendererWindow.send('download-started', data.uuid);
          },
          onProgress: progress => {
            rendererWindow.send('download-progress', {
              uuid: data.uuid,
              progress
            });
          }
        });
      })
      .then(() => {
        rendererWindow.send('download-finished', data.uuid);
      })
      .catch(error => {
        logger.error(error);
        rendererWindow.send('download-error', { uui: data.uuid, error });
      });
    
  });
};
