import logger from 'electron-timber';
import _ from 'lodash';

import { StreamData, StreamQuery } from '../plugins.types';
import StreamProviderPlugin from '../streamProvider';
import * as Soundcloud from '../../rest/Soundcloud';

class SoundcloudPlugin extends StreamProviderPlugin {
  constructor() {
    super();
    this.name = 'Soundcloud Plugin';
    this.sourceName = 'Soundcloud';
    this.description = 'Allows Nuclear to find music streams on Soundcloud';
    this.image = null;
    this.isDefault = true;
  }

  resultToStream = (result): StreamData => {
    return {
      source: this.sourceName,
      id: result.id,
      streamFormat: this.identifyStreamFormat(result.stream),
      stream: result.stream,
      duration: result.duration / 1000,
      title: result.title,
      thumbnail: result.user.avatar_url,
      originalUrl: result.permalink_url
    };
  };

  async search(query: StreamQuery): Promise<StreamData[] | undefined> {
    const terms = query.artist + ' ' + query.track;
    try {
      const results = [];
      results.push(await await Soundcloud.soundcloudSearch(terms));
      return results && results.map(this.resultToStream);
    } catch (err) {
      logger.error(`Error while looking up streams for ${terms} on Soundcloud`);
      logger.error(err);
    }
  }

  async getStreamForId(id: string): Promise<undefined | StreamData> {
    return null;
  }
}

export default SoundcloudPlugin;
