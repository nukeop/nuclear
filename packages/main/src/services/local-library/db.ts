import { NuclearBrutMeta, NuclearStream } from '@nuclear/core';
import ElectronStore from 'electron-store';
import { injectable, inject } from 'inversify';
import _ from 'lodash';
import url from 'url';
import path from 'path';

import Logger, { $mainLogger } from '../logger';
import Config from '../config';

export type LocalMeta = Record<string, NuclearBrutMeta>;

export interface LocalSearchQuery {
  artist: string;
  track: string;
}

@injectable()
class LocalLibraryDb extends ElectronStore {
  constructor(
    @inject(Config) config: Config,
    @inject($mainLogger) logger: Logger
  ) {
    super({ name: 'nuclear-local-library' });

    if (config.isProd() && process.argv[1]) {
      this.addLocalFolder(
        path.dirname(
          path.resolve(process.cwd(), process.argv[1])
        )
      );
    }
  
    logger.log(`Initialized library index at ${ this.path }`);
  }

  getLocalFolders(): string[] {
    return this.get('localFolders') || [];
  }

  removeLocalFolder(folder: string) {
    const folders = this.getLocalFolders();
    this.set('localFolders', folders.filter(path => path !== folder));

    const cache = Object
      .values(this.getCache())
      .filter(({ path }) => !path.includes(folder))
      .reduce(
        (acc, item) => ({ ...acc, [item.uuid]: item }),
        {}
      );
    this.set('localMeta', cache);

    return cache;
  }

  getCache(): LocalMeta {
    return this.get('localMeta') || {};
  }

  addLocalFolder(folder: string) {
    const localFolders = this.getLocalFolders();
    if (localFolders.includes(folder)) {
      return;
    }
  
    if (this.isParentOfFolder(folder)) {
      localFolders.filter(file => !file.startsWith(folder));
    }

    localFolders.push(folder);
    this.set('localFolders', localFolders);
  }

  updateCache(formattedMetas: NuclearBrutMeta[], baseFiles?: string[]): LocalMeta {
    const oldCache = this.getCache();

    const cache = Object.values(oldCache)
      .filter(({ path }) => baseFiles ? baseFiles.includes(path as string) : true)
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

  mapToStream(track: NuclearBrutMeta): NuclearStream {
    return {
      uuid: track.uuid,
      title: track.name,
      duration: track.duration,
      source: 'Local',
      stream: url.format({
        pathname: track.path,
        protocol: 'file',
        slashes: true
      })
    };
  }

  private byArtist(): Record<string, NuclearBrutMeta[]> {
    const cache = this.getCache();

    return _.groupBy(Object.values(cache), track => track.artist.name);
  }

  search({ artist, track }: LocalSearchQuery) {
    const byArtist = this.byArtist();

    const result = Object.keys(byArtist)
      .filter(artistKey => artistKey.includes(artist))
      .map(artist => byArtist[artist])
      .flat()
      .filter(song => song.name && song.name.includes(track))
      .map(this.mapToStream)
      .pop();

    return result;
  }

  private isParentOfFolder(filePath: string): boolean {
    const localFolders = this.getLocalFolders();

    return !localFolders.reduce<boolean>((acc, folder) => {
      return acc && !filePath.includes(folder);
    }, true);
  }

  filterParentFolder(folders: string[]): string[] {
    return folders.filter((folder) => !this.isParentOfFolder(folder));
  }

  filterNotStored(filesPath: string[]): string[] {
    const cache = this.getCache();
    const storedPath = Object.values(cache).map(({ path }) => path);

    return filesPath.filter(file => !storedPath.includes(file));
  }

  getFromPath(filePaths: string[]): NuclearBrutMeta[] {
    const cache = this.getCache();

    return Object.values(cache).filter(({ path }) => filePaths.includes(path));
  }
}

export default LocalLibraryDb;
