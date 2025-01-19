import { logger } from '../../';
import _ from 'lodash';

import { StreamQuery, StreamData } from '../plugins.types';
import StreamProviderPlugin from '../streamProvider';
import * as Jamendo from '../../rest/Jamendo';

class JamendoPlugin extends StreamProviderPlugin {
  constructor(){
    super();
    this.name = 'Jamendo Plugin';
    this.sourceName = 'Jamendo';
    this.description = 'Allows Nuclear to find music streams on Jamendo';
    this.image = null;
  }

  search(query: StreamQuery): Promise<undefined | StreamData[]>  {
    return this.getSearchResults(query)
      .then(responseJson => {
        if (responseJson.results.length === 0) {
          return null;
        }

        const track = responseJson.results[0].tracks[0];
        return [{
          source: this.sourceName,
          id: track.id,
          stream: track.audio,
          duration: track.duration,
          title: track.name,
          thumbnail: track.image,
          originalUrl: track.audio
        }];
      });
  }

  getSearchResults(query) {
    return Jamendo.search(query)
      .then(response => response.json())
      .catch(err => {
        logger.error(`Error looking up streams for ${query.artist} ${query.track} on Jamendo`);
        logger.error(err);
      });
  }

  async getStreamForId(id: string): Promise<undefined | StreamData> {
    return this.getTrackById(id).then(responseJson => {
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
        thumbnail: track.image,
        originalUrl: track.audio
      };
    });
  }

  getTrackById(id: string) {
    return Jamendo.getTrackById(id)
      .then(response => response.json())
      .catch(err => {
        logger.error(`Error looking up streams for id: ${id} on Jamendo`);
        logger.error(err);
      });
  }
}

export default JamendoPlugin;
