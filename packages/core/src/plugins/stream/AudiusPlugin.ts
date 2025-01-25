import { logger } from '../../';
import _ from 'lodash';

import { StreamData, StreamQuery } from '../plugins.types';
import StreamProviderPlugin from '../streamProvider';
import * as Audius from '../../rest/Audius';

class AudiusPlugin extends StreamProviderPlugin {
  constructor() {
    super();
    this.name = 'Audius Plugin';
    this.sourceName = 'Audius';
    this.description =
      'A plugin that adds Audius search and streaming support to Nuclear.';
    this.baseUrl = 'https://audius.co';
    this.image = null;
    this.init();
  }

  async init() {
    this.apiEndpoint = await Audius._findHost();
  }

  async search(query: StreamQuery): Promise<StreamData[] | undefined> {
    const terms = query.artist + ' ' + query.track;
    try {
      const results = await (
        await Audius.trackSearch(this.apiEndpoint, terms)
      ).json();
      const info = results.data;
      return info && info.map(this.createStreamData);
    } catch (err) {
      logger.error(`Error while looking up streams for ${terms} on Audius`);
      logger.error(err);
    }
  }

  createStreamData(result): StreamData {
    return {
      source: this.sourceName,
      id: result.id,
      stream: `${this.apiEndpoint}/tracks/${result.id}/stream?app_name=Nuclear`,
      duration: result.duration,
      title: result.title,
      thumbnail: result.artwork ? result.artwork['480x480'] : '',
      originalUrl: `${this.baseUrl}${result.permalink}`
    };
  }

  async getStreamForId(id: string): Promise<undefined | StreamData> {
    try {
      const results = await (
        await Audius.getTrack(this.apiEndpoint, id)
      ).json();
      return results.data && this.createStreamData(results.data);
    } catch (err) {
      logger.error(`Error while looking up streams for id: ${id} on Audius`);
      logger.error(err);
    }
  }
}

export default AudiusPlugin;
