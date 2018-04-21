import _ from 'lodash';

import MusicSourcePlugin from '../musicSources';
import * as Soundcloud from '../../rest/Soundcloud';

class SoundcloudPlugin extends MusicSourcePlugin {
  constructor() {
    super();
    this.name = 'Soundcloud Plugin';
    this.sourceName = 'Soundcloud';
    this.description = 'Allows Nuclear to find music streams on Soundcloud';
  }

  resultToStream(result) {
    return {
      source: this.sourceName,
      id: result.id,
      stream: result.stream_url,
      duration: result.duration,
      title: result.title,
      thumbnail: result.user.avatar_url
    };
  }

  search(terms) {
    return Soundcloud.soundcloudSearch(terms)
    .then(data => data.json())
    .then(results => {
      let info = results[0];
      return info ? this.resultToStream(info) : null;
    })
    .catch(err => {
      console.error(`Error looking up streams for ${terms} on Soundcloud`);
      console.error(err);
    });
  }

  getAlternateStream(terms, currentStream) {
    return Soundcloud.soundcloudSearch(terms)
    .then(data => data.json())
    .then(results => {
      let info = _.find(results, result => result && result.id !== currentStream.id);
      return info ? this.resultToStream(info) : null;
    })
    .catch(err => {
      console.error(`Error looking up streams for ${terms} on Soundcloud`);
      console.error(err);
    });
  }
}

export default SoundcloudPlugin;
