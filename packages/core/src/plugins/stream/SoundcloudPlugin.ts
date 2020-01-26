import logger from 'electron-timber';
import _ from 'lodash';

import globals from '../../../../app/app/globals';
import StreamProviderPlugin from '../streamProvider';
import * as Soundcloud from '../../../../app/app/rest/Soundcloud';

class SoundcloudPlugin implements StreamProviderPlugin {
  name: 'Soundcloud Plugin';
  sourceName: 'Soundcloud';
  description: 'Allows Nuclear to find music streams on Soundcloud';
  image: null;

  resultToStream(result) {
    return {
      source: this.sourceName,
      id: result.id,
      stream: result.stream_url + `?client_id=${globals.soundcloudApiKey}`,
      duration: result.duration,
      title: result.title,
      thumbnail: result.user.avatar_url
    };
  }

  search(query: StreamQuery) {
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

  getAlternateStream(query: StreamQuery, currentStream: { id: string }) {
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
