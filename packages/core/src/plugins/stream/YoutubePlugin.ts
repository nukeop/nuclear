import logger from 'electron-timber';
import _ from 'lodash';
import ytdl from 'ytdl-core';

import StreamProviderPlugin from '../streamProvider';
import * as Youtube from '../../rest/Youtube';

class YoutubePlugin implements StreamProviderPlugin {
  name: 'Youtube Plugin';
  sourceName: 'Youtube';
  description: 'A plugin allowing Nuclear to search for music and play it from youtube';
  image: null;

  search(query: StreamQuery): Promise<StreamData|void> {
    let terms = query.artist + ' ' + query.track;
    return Youtube.trackSearch(terms)
      .then(results => results.json())
      .then(results => {
        let song = _.head(results.items);
        let id = song.id.videoId;
        return ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`);
      })
      .then(videoInfo => {
        let thumbnail = _.get(videoInfo, 'player_response.videoDetails.thumbnail.thumbnails');
        thumbnail = _.find(thumbnail, { width: 246 }).url;
        let formatInfo = _.head(videoInfo.formats.filter(e => e.itag === 140));

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

  getAlternateStream(query: StreamQuery, currentStream: { id: string }): Promise<StreamData|void> {
    let terms = query.artist + ' ' + query.track;
    return Youtube.trackSearch(terms)
      .then(results => results.json())
      .then(results => {
        let song = _(results.items).find(item => {
          return item && item.id.videoId !== currentStream.id;
        });
        let id = song.id.videoId;
        return ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`);
      })
      .then(videoInfo => {
        let formatInfo = _.head(videoInfo.formats.filter(e => e.itag === 140));
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
