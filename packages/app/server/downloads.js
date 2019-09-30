import 'isomorphic-fetch';
import electronDl, { download } from 'electron-dl';
import logger from 'electron-timber';
import ytdl from 'ytdl-core';
import _ from 'lodash';
import { ipcMain } from 'electron';

import { trackSearch } from '../app/rest/youtube-search';
import { getOption } from './store';

let rendererWindow = null;
electronDl();

export const registerDownloadsEvents = window => {
  ipcMain.once('started', event => {
    rendererWindow = event.sender;
  });
  
  ipcMain.on('start-download', (event, data) => {
    const artistName = _.isString(_.get(data, 'artist'))
      ? _.get(data, 'artist')
      : _.get(data, 'artist.name');
    
    const query = `${artistName} ${_.get(data, 'name')}`;
    const filename = `${artistName} - ${_.get(data, 'name')}`;

    logger.log(`Received a download request: ${artistName} - ${_.get(data, 'name')}`);

    // In order to get a valid stream URL, we need to generate it right before downloading
    trackSearch(query)
      .then(results => results.json())
      .then(ytData => {
        const trackId = _.get(_.head(ytData.items), 'id.videoId');
        return ytdl.getInfo(`http://www.youtube.com/watch?v=${trackId}`);
      })
      .then(videoInfo => {
        const formatInfo = _.head(videoInfo.formats.filter(e => e.itag === '140'));
        const streamUrl = formatInfo.url;
        
        return download(window, streamUrl, {
          filename: filename + `.${_.get(formatInfo, 'container')}`,
          directory: getOption('downloads.dir'),
          onStarted: () => {
            rendererWindow.send('download-started', data.uuid);
          },
          onProgress: _.throttle(progress => {
            rendererWindow.send('download-progress', {
              uuid: data.uuid,
              progress
            });
          }, 1000)
        });
      })
      .then(() => {
        logger.log(data);
        rendererWindow.send('download-finished', data.uuid);
      })
      .catch(error => {
        logger.error(error);
        rendererWindow.send('download-error', { uuid: data.uuid, error });
      });
    
  });
};
