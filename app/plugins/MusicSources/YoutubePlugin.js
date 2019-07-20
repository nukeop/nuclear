import logger from 'electron-timber';
import _ from 'lodash';
import ytdl from 'ytdl-core';

import MusicSourcePlugin from '../musicSources';
import * as Youtube from '../../rest/Youtube';

class YoutubePlugin extends MusicSourcePlugin {
  constructor() {
    super();
    this.name = 'Youtube Plugin';
    this.sourceName = 'Youtube';
    this.description = 'A plugin allowing Nuclear to search for music and play it from youtube';
  }

  search(query) {
    let terms = query.artist + ' ' + query.track;
    return Youtube.trackSearch(terms)
      .then(results => results.json())
      .then(results => {
        let song = _.head(results.items);
        let id = song.id.videoId;
        return ytdl.getInfo(`http://www.youtube.com/watch?v=${id}`);
      })
      .then(videoInfo => {
        let thumbnail = _.get(videoInfo, 'player_response.videoDetails.thumbnail.thumbnails');
        thumbnail = _.find(thumbnail, { width: 246 }).url;
        let formatInfo = _.head(videoInfo.formats.filter(e => e.itag === '140'));
        return {
          source: this.sourceName,
          id: videoInfo.video_id,
          stream: formatInfo.url,
          duration: videoInfo.length_seconds,
          title: videoInfo.title,
          thumbnail
        };
      })
      .catch(error => {
        logger.error(`Error while searching  for ${terms} on Youtube`);
        logger.error(error); 
      });
  }

  getAlternateStream(query, currentStream) {
    let terms = query.artist + ' ' + query.track;
    return Youtube.trackSearch(terms)
      .then(results => results.json())
      .then(results => {
        let song = _(results.items).find(item => {
          return item && item.id.videoId !== currentStream.id;
        });
        let id = song.id.videoId;
        return ytdl.getInfo(`http://www.youtube.com/watch?v=${id}`);
      })
      .then(videoInfo => {
        let formatInfo = _.head(videoInfo.formats.filter(e => e.itag === '140'));
        return {
          source: 'Youtube',
          id: videoInfo.video_id,
          stream: formatInfo.url,
          duration: videoInfo.length_seconds,
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
