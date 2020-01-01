import { NuclearBrutMeta } from '@nuclear/common';
import ElectronStore from 'electron-store';
import { injectable, inject } from 'inversify';
import _ from 'lodash';
import url from 'url';
import path from 'path';

import Logger, { mainLogger } from '../logger';
import Config from '../config';

type LocalMeta = Record<string, NuclearBrutMeta>;

export interface LocalSearchQuery {
  artist: string;
  track: string;
}

@injectable()
class LocalLibraryDb extends ElectronStore {
  constructor(
    @inject(Config) config: Config,
    @inject(mainLogger) logger: Logger
  ) {
    super({ name: 'nuclear-local-library' });

    if (config.isProd() && process.argv[1]) {
      this.addLocalFolder(
        path.dirname(
          path.resolve(process.cwd(), process.argv[1])
        )
      )
    }
    logger.log(`Initialized library index at ${ this.path }`);
  }

  getLocalFolders(): string[] {
    return this.get('localFolders') || [];
  }

  addLocalFolder(folder: string) {
    const localFolders = this.get('localFolders') || [];
    if (localFolders.includes(folder)) {
      return;
    };
    localFolders.push(folder);
    this.set('localFolders', localFolders);
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
