import logger from 'electron-timber';
import _ from 'lodash';

import MusicSourcePlugin from '../musicSources';
import * as Jamendo from '../../rest/Jamendo';

class JamendoPlugin extends MusicSourcePlugin {
  constructor() {
    super();
    this.name = 'Jamendo Plugin';
    this.sourceName = 'Jamendo';
    this.description = 'Allows Nuclear to find music streams on Jamendo';
  }

  search (query) {
    return this.getSearchResults(query).then(responseJson => {
      if (responseJson.results.length === 0) {
        return null;
      }

      const track = responseJson.results[0].tracks[0];

      return {
        source: this.sourceName,
        id: track.id,
        stream: track.audio,
        duration: track.duration,
        title: track.name,
        thumbnail: track.image
      };
    });
  }

  getSearchResults (query) {
    return Jamendo.search(query)
      .then(response => response.json())
      .catch(err => {
        logger.error(`Error looking up streams for ${query.artist} ${query.track} on Jamendo`);
        logger.error(err);
      });
  }

  getAlternateStream (query, currentStream) {
    return this.getSearchResults(query).then(results => {
      let info = _.find(results, result => result && result.id !== currentStream.id);
      return info ? this.resultToStream(info) : null;
    });
  }
}

export default JamendoPlugin;
