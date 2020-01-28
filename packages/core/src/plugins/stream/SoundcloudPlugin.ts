import logger from 'electron-timber';
import _ from 'lodash';

import StreamProviderPlugin from '../streamProvider';
import * as Soundcloud from '../../rest/Soundcloud';

class SoundcloudPlugin extends StreamProviderPlugin {
  constructor() {
    super();
    this.name = 'Soundcloud Plugin';
    this.sourceName = 'Soundcloud';
    this.description = 'Allows Nuclear to find music streams on Soundcloud';
    this.image = null;
  }

  resultToStream(result) {
    return {
      source: this.sourceName,
      id: result.id,
      stream: result.stream_url + `?client_id=${process.env.SOUNDCLOUD_API_KEY}`,
      duration: result.duration,
      title: result.title,
      thumbnail: result.user.avatar_url
    };
  }

  search(query: StreamQuery): Promise<StreamData | void> {
    let terms = query.artist + ' ' + query.track;
    return Soundcloud.soundcloudSearch(terms)
      .then(data => data.json())
      .then(results => {
        let info = results[0];
        return info ? this.resultToStream(info) : null;
      })
      .catch(err => {
        logger.error(`Error while looking up streams for ${terms} on Soundcloud`);
        logger.error(err);
      });
  }

  getAlternateStream(query: StreamQuery, currentStream: { id: string }): Promise<StreamData | void> {
    let terms = query.artist + ' ' + query.track;
    return Soundcloud.soundcloudSearch(terms)
      .then(data => data.json())
      .then(results => {
        let info = _.find(results, result => result && result.id !== currentStream.id);
        return info ? this.resultToStream(info) : null;
      })
      .catch(err => {
        logger.error(`Error while looking up streams for ${terms} on Soundcloud`);
        logger.error(err);
      });
  }
}

export default SoundcloudPlugin;
