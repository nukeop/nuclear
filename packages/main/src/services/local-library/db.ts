import { NuclearBrutMeta } from '@nuclear/common';
import ElectronStore from 'electron-store';
import { injectable, inject } from 'inversify';
import _ from 'lodash';
import url from 'url';

import Logger, { mainLogger } from '../logger';

type LocalMeta = Record<string, NuclearBrutMeta>;

export interface LocalSearchQuery {
  artist: string;
  track: string;
}

@injectable()
class LocalLibraryDb extends ElectronStore {
  constructor(
    @inject(mainLogger) private logger: Logger
  ) {
    super({ name: 'nuclear-local-library' });

    logger.log(`Initialized library index at ${ this.path }`);
  }

  byArtist(): Record<string, NuclearBrutMeta[]> {
    const cache: LocalMeta = this.get('localMeta');

    return cache ? _.groupBy(Object.values(cache), track => track.artist.name) : {};
  }

  search({ artist, track }: LocalSearchQuery) {
    const byArtist = this.byArtist();

    const result = Object.keys(byArtist)
      .filter(artistKey => artistKey.includes(artist))
      .map(artist => byArtist[artist])
      .flat()
      .filter(song => song.name && song.name.includes(track))
      .map(track => ({
        uuid: track.uuid,
        title: track.name,
        duration: track.duration,
        source: 'Local',
        stream: url.format({
          pathname: track.path,
          protocol: 'file',
          slashes: true
        }),
        thumbnail: track.image && track.image[0] ? track.image[0]['#text'] : undefined
      }))
      .pop();

    return result;
  }

  updateCache(baseFiles: string[], formattedMetas: NuclearBrutMeta[]) {
    const oldCache: LocalMeta = this.get('localMeta') || {};

    const cache = Object.values(oldCache)
    .filter(({ path }) => baseFiles.includes(path as string))
    .concat(formattedMetas)
    .reduce(
      (acc, item) => ({
        ...acc,
        [item.uuid]: item
      }),
      {}
    );

    this.set('localMeta', cache);

    return cache;
  }

  getCache(): LocalMeta {
    return this.get('localMeta');
  }
}

export default LocalLibraryDb;
