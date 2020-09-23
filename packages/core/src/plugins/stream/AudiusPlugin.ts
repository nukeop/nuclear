import logger from 'electron-timber';
import _ from 'lodash';

import { StreamData, StreamQuery } from '../plugins.types';
import StreamProviderPlugin from '../streamProvider';
import * as Audius from '../../rest/Audius';

class AudiusPlugin extends StreamProviderPlugin {
  constructor() {
    super();
    this.name = 'Audius Plugin';
    this.sourceName = 'Audius';
    this.description = 'A plugin that adds Audius search and streaming support to Nuclear.';
    this.image = null;
    this.init();
  }

  async init(){
    this.apiEndpoint = await Audius._findHost();
  }

  search(query: StreamQuery): Promise<StreamData | void> {
    const terms = query.artist + ' ' + query.track;
    return Audius.trackSearch(this.apiEndpoint, terms)
      .then(data => data.json())
      .then(results => {
        const info = results.data[0];
        return info ? this.createStreamData(info) : null;
      })
      .catch(err => {
        logger.error(`Error while looking up streams for ${terms} on Audius`);
        logger.error(err);
      });
  }

  getAlternateStream(query: StreamQuery, currentStream: { id: string }): Promise<StreamData | void> {
    const terms = query.track;
    return Audius.trackSearch(this.apiEndpoint, terms)
      .then(data => data.json())
      .then(results => {
        const info = _.find(results.data, result => result && result.id !== currentStream.id);
        return info ? this.createStreamData(info) : null;
      })
      .catch(err => {
        logger.error(`Error while looking up alternate streams for ${terms} on Audius`);
        logger.error(err);
      });
  }

  createStreamData(result): StreamData {
    return {
      source: this.sourceName,
      id: result.id,
      stream: `${this.apiEndpoint}/tracks/${result.id}/stream?app_name=Nuclear`,
      duration: result.duration,
      title: result.title,
      thumbnail: result.artwork ? result.artwork['480x480'] : ''
    };
  }
}

export default AudiusPlugin;
