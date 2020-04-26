import logger from 'electron-timber';
import _ from 'lodash';
import ytdl from 'ytdl-core';

import { StreamData, StreamQuery } from '../plugins.types';
import StreamProviderPlugin from '../streamProvider';
import * as Youtube from '../../rest/Youtube';

class YoutubePlugin extends StreamProviderPlugin {
  constructor() {
    super();
    this.name = 'Youtube Plugin';
    this.sourceName = 'Youtube';
    this.description = 'A plugin allowing Nuclear to search for music and play it from youtube';
    this.image = null;
  }

  search(query: StreamQuery): Promise<StreamData | void> {
    const terms = query.artist + ' ' + query.track;
    return Youtube.trackSearch(terms)
      .then(results => results.json())
      .then(results => {
        const song: { id: { videoId: string }} = _.head(results.items);
        const id = song.id.videoId;
        return ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`);
      })
      .then(videoInfo => {
        let thumbnail = _.get(videoInfo, 'player_response.videoDetails.thumbnail.thumbnails');
        thumbnail = _.find(thumbnail, { width: 246 }).url;
        const formatInfo = _.head(videoInfo.formats.filter(e => e.itag === 140));

        return {
          source: this.sourceName,
          id: videoInfo.video_id,
          stream: formatInfo.url,
          duration: parseInt(videoInfo.length_seconds),
          title: videoInfo.title,
          thumbnail
        };
      })
      .catch(error => {
        logger.error(`Error while searching  for ${terms} on Youtube`);
        logger.error(error);
      });
  }

  getAlternateStream(query: StreamQuery, currentStream: { id: string }): Promise<StreamData | void> {
    const terms = query.artist + ' ' + query.track;
    return Youtube.trackSearch(terms)
      .then(results => results.json())
      .then(results => {
        const song = _(results.items).find(item => {
          return item && item.id.videoId !== currentStream.id;
        });
        const id = song.id.videoId;
        return ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`);
      })
      .then(videoInfo => {
        const formatInfo = _.head(videoInfo.formats.filter(e => e.itag === 140));
        return {
          source: this.sourceName,
          id: videoInfo.video_id,
          stream: formatInfo.url,
          duration: parseInt(videoInfo.length_seconds),
          title: videoInfo.title,
          thumbnail: videoInfo.thumbnail_url
        };
      })
      .catch(error => {
        logger.error(`Error while looking up streams for ${terms} on Youtube`);
        logger.error(error);
      });
  }
}

export default YoutubePlugin;
